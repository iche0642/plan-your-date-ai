// @ts-nocheck
// supabase/functions/get-free-slots/index.ts

//TODO: logic for busy slots not working yet

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import * as ICAL from 'npm:ical.js@1.5.0';
import {
  format,
  formatISO,
  addDays, // Keep addDays for all-day event adjustment
  addWeeks,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  isBefore,
  isAfter,
  max,
  min,
  differenceInMinutes,
  eachDayOfInterval,
} from 'npm:date-fns@2.30.0';

// --- CONFIGURATION CONSTANTS ---
const DEFAULT_WORKING_HOURS_START = '09:00'; // "HH:mm"
const DEFAULT_WORKING_HOURS_END = '17:00';   // "HH:mm"
const DEFAULT_MIN_SLOT_DURATION_MINUTES = 30;
const WEEK_STARTS_ON: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1; // 0=Sun, 1=Mon
const IGNORE_ALL_DAY_EVENTS_WHEN_CALCULATING_FREE_SLOTS = false;
// --- END CONFIGURATION CONSTANTS ---

// Helper to expand recurring events and identify BUSY slots
const getBusySlotsFromCalendar = (component: any, rangeStartDate: Date, rangeEndDate: Date) => {
  const busyEvents: { start: Date; end: Date; summary: string }[] = [];
  console.log(`[DEBUG getBusySlots] Expanding for range: ${formatISO(rangeStartDate)} to ${formatISO(rangeEndDate)}`);
  try {
    const vevents = component.getAllSubcomponents('vevent');
    console.log(`[DEBUG getBusySlots] Found ${vevents.length} VEVENT components in ICS.`);

    for (const veventComponent of vevents) {
      try {
        const event = new ICAL.Event(veventComponent);
        const summary = event.summary || 'No Summary';
        const transp = veventComponent.getFirstPropertyValue('transp');
        const isEventAllDay = event.startDate.isDate;

        console.log(`[DEBUG getBusySlots] Processing VEVENT: "${summary}", Start: ${event.startDate.toString()}, End: ${event.endDate.toString()}, AllDay: ${isEventAllDay}, TRANSP: ${transp}`);

        if (transp === 'TRANSPARENT') {
          console.log(`[DEBUG getBusySlots] Skipping TRANSPARENT event: "${summary}" as it does not block time.`);
          continue;
        }

        if (IGNORE_ALL_DAY_EVENTS_WHEN_CALCULATING_FREE_SLOTS && isEventAllDay) {
          console.log(`[DEBUG getBusySlots] Skipping ALL-DAY event (due to config): "${summary}"`);
          continue;
        }
        
        let effectiveEventStart = event.startDate.toJSDate();
        let effectiveEventEnd = event.endDate.toJSDate();

        if (isEventAllDay && !IGNORE_ALL_DAY_EVENTS_WHEN_CALCULATING_FREE_SLOTS) {
            effectiveEventStart = startOfDay(effectiveEventStart);
            // For iCalendar, DTEND for an all-day event is the start of the *next* day.
            // To make it inclusive for busy slot calculation, we want the end of the *last* day of the event.
            // Example: A 1-day event on March 20th has DTSTART;VALUE=DATE:20240320, DTEND;VALUE=DATE:20240321
            // We want it to cover March 20th 00:00 to March 20th 23:59:59.999
            if (event.endDate.isDate) { // Check if DTEND is a DATE value
                 // DTEND is exclusive, so subtract one day and take endOfDay
                effectiveEventEnd = endOfDay(addDays(event.endDate.toJSDate(), -1));
            } else {
                // If DTEND has a time part (unusual for true all-day, but to be safe)
                effectiveEventEnd = endOfDay(event.endDate.toJSDate());
            }
            console.log(`[DEBUG getBusySlots] All-day event "${summary}" adjusted to: ${formatISO(effectiveEventStart)} - ${formatISO(effectiveEventEnd)}`);
        }


        if (event.isRecurring()) {
          console.log(`[DEBUG getBusySlots] Event "${summary}" is recurring. Iterating occurrences...`);
          const iterator = event.iterator(ICAL.Time.fromDate(rangeStartDate));
          let nextOccurenceTime;
          while (
            (nextOccurenceTime = iterator.next()) &&
            nextOccurenceTime.compare(ICAL.Time.fromDate(rangeEndDate)) <= 0
          ) {
            const occurrenceDetails = event.getOccurrenceDetails(nextOccurenceTime);
            let occStart = occurrenceDetails.startDate.toJSDate();
            let occEnd = occurrenceDetails.endDate.toJSDate();
            const isOccAllDay = occurrenceDetails.startDate.isDate;

            if (IGNORE_ALL_DAY_EVENTS_WHEN_CALCULATING_FREE_SLOTS && isOccAllDay) {
                console.log(`[DEBUG getBusySlots] Skipping ALL-DAY recurring instance: "${summary}"`);
                continue;
            }
            
            if (isOccAllDay && !IGNORE_ALL_DAY_EVENTS_WHEN_CALCULATING_FREE_SLOTS) {
                occStart = startOfDay(occStart);
                if (occurrenceDetails.endDate.isDate) {
                    occEnd = endOfDay(addDays(occurrenceDetails.endDate.toJSDate(), -1));
                } else {
                    occEnd = endOfDay(occurrenceDetails.endDate.toJSDate());
                }
            }

            if (occEnd > rangeStartDate && occStart < rangeEndDate) {
              busyEvents.push({ start: occStart, end: occEnd, summary });
              console.log(`[DEBUG getBusySlots] ADDED RECURRING instance for "${summary}" to busy list: ${formatISO(occStart)} - ${formatISO(occEnd)}`);
            }
          }
        } else { 
          if (effectiveEventEnd > rangeStartDate && effectiveEventStart < rangeEndDate) {
            busyEvents.push({ start: effectiveEventStart, end: effectiveEventEnd, summary });
            console.log(`[DEBUG getBusySlots] ADDED NON-RECURRING event "${summary}" to busy list: ${formatISO(effectiveEventStart)} - ${formatISO(effectiveEventEnd)}`);
          } else {
            // console.log(`[DEBUG getBusySlots] Non-recurring event "${summary}" OUT OF OVERALL RANGE: ${formatISO(effectiveEventStart)} - ${formatISO(effectiveEventEnd)}`);
          }
        }
      } catch (eventProcessingError) {
        const summary = veventComponent.getFirstPropertyValue('summary');
        console.warn(`[DEBUG getBusySlots] Error processing a VEVENT, skipping. Summary: ${summary || 'N/A'}. Error: ${eventProcessingError.message}`);
      }
    }
  } catch (expansionError) {
    console.error(`[DEBUG getBusySlots] Critical error during event expansion: ${expansionError.message}`, expansionError.stack);
  }
  console.log(`[DEBUG getBusySlots] Returning ${busyEvents.length} busy events from this ICS.`);
  return busyEvents;
};


const parseTimeStringToDate = (timeStr: string, date: Date): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return setMilliseconds(setSeconds(setMinutes(setHours(date, hours), minutes), 0), 0);
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  const timestamp = `[${new Date().toISOString()}]`;
  console.log(`${timestamp} GET-FREE-SLOTS Function invoked. Method: ${req.method}`);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { calendarUrls } = body;

    console.log(`${timestamp} Config: IgnoreAllDayForFreeSlots: ${IGNORE_ALL_DAY_EVENTS_WHEN_CALCULATING_FREE_SLOTS}, WH: ${DEFAULT_WORKING_HOURS_START}-${DEFAULT_WORKING_HOURS_END}, MinSlot: ${DEFAULT_MIN_SLOT_DURATION_MINUTES}`);

    if (!calendarUrls || !Array.isArray(calendarUrls) || calendarUrls.length === 0) {
      return new Response(JSON.stringify({ error: 'calendarUrls array is required.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const today = new Date();
    const startOfNextCalendarWeek = startOfWeek(addWeeks(today, 1), { weekStartsOn: WEEK_STARTS_ON });
    const endOfNextCalendarWeek = endOfWeek(addWeeks(today, 1), { weekStartsOn: WEEK_STARTS_ON });
    const searchRangeStart = startOfDay(startOfNextCalendarWeek);
    const searchRangeEnd = endOfDay(endOfNextCalendarWeek);

    console.log(`${timestamp} Overall Search Range (Next Week): ${formatISO(searchRangeStart)} to ${formatISO(searchRangeEnd)}`);

    let allBusySlots: { start: Date; end: Date; summary: string }[] = [];
    for (const url of calendarUrls) {
      console.log(`${timestamp} Processing URL: ${url.substring(0, 100)}...`);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.warn(`${timestamp} Failed to fetch ${url.substring(0,50)}...: ${response.status} ${response.statusText}`);
          continue;
        }
        const icsData = await response.text();
        if (icsData.trim() === "") {
            console.warn(`${timestamp} ICS data for ${url.substring(0,50)}... is empty. Skipping.`);
            continue;
        }
        const jcalData = ICAL.parse(icsData);
        const component = new ICAL.Component(jcalData);
        const calendarBusyEvents = getBusySlotsFromCalendar(component, searchRangeStart, searchRangeEnd);
        allBusySlots.push(...calendarBusyEvents);
      } catch (fetchParseError) {
        console.warn(`${timestamp} Error fetching/parsing calendar ${url.substring(0,50)}...: ${fetchParseError.message}`);
      }
    }
    console.log(`${timestamp} Total raw busy slots from all calendars: ${allBusySlots.length}`);
    if (allBusySlots.length > 0) {
        console.log(`[DEBUG] First 5 raw busy slots:`, allBusySlots.slice(0,5).map(s => ({summary:s.summary, start: formatISO(s.start), end: formatISO(s.end)})));
    }

    allBusySlots.sort((a, b) => a.start.getTime() - b.start.getTime());
    const mergedBusySlots: { start: Date; end: Date }[] = [];
    if (allBusySlots.length > 0) {
        let currentSlot = { start: allBusySlots[0].start, end: allBusySlots[0].end };
        for (let i = 1; i < allBusySlots.length; i++) {
            const nextSlot = allBusySlots[i];
            if (nextSlot.start.getTime() <= currentSlot.end.getTime() + 60000) { 
                currentSlot.end = new Date(Math.max(currentSlot.end.getTime(), nextSlot.end.getTime()));
            } else {
                mergedBusySlots.push(currentSlot);
                currentSlot = { start: nextSlot.start, end: nextSlot.end };
            }
        }
        mergedBusySlots.push(currentSlot);
    }
    console.log(`${timestamp} Total merged busy slots: ${mergedBusySlots.length}`);
    if (mergedBusySlots.length > 0) {
        console.log(`[DEBUG] First 5 merged busy slots:`, mergedBusySlots.slice(0,5).map(s => ({start: formatISO(s.start), end: formatISO(s.end)})));
    }
    if (mergedBusySlots.length === 0 && allBusySlots.length > 0) {
        console.warn("[DEBUG] Merging resulted in zero slots, but there were raw busy slots. This is unusual.");
    }
    if (mergedBusySlots.length === 0 && allBusySlots.length === 0) {
        console.log("[DEBUG] No busy slots found from any calendar. All time within working hours will be marked free.");
    }

    const calculatedFreeSlots: { start: Date; end: Date }[] = [];
    const daysToScan = eachDayOfInterval({ start: searchRangeStart, end: searchRangeEnd });

    for (const dayBase of daysToScan) {
      const currentDayForLog = format(dayBase, 'yyyy-MM-dd');
      const dayWorkingStart = parseTimeStringToDate(DEFAULT_WORKING_HOURS_START, dayBase);
      const dayWorkingEnd = parseTimeStringToDate(DEFAULT_WORKING_HOURS_END, dayBase);

      console.log(`[DEBUG FreeCalc] Day: ${currentDayForLog}, Working Hours: ${formatISO(dayWorkingStart)} to ${formatISO(dayWorkingEnd)}`);

      if (isBefore(dayWorkingEnd, dayWorkingStart) || dayWorkingStart.getTime() === dayWorkingEnd.getTime()) {
          console.log(`[DEBUG FreeCalc] Day: ${currentDayForLog}, Skipping due to invalid/zero working hours.`);
          continue;
      }
      
      const dayRelevantBusySlots = mergedBusySlots.filter(slot =>
        isAfter(slot.end, dayWorkingStart) && isBefore(slot.start, dayWorkingEnd)
      );
      
      console.log(`[DEBUG FreeCalc] Day: ${currentDayForLog}, Found ${dayRelevantBusySlots.length} relevant merged busy slots.`);
      if(dayRelevantBusySlots.length > 0) {
        console.log(`[DEBUG FreeCalc] Day: ${currentDayForLog}, Relevant busy slots:`, dayRelevantBusySlots.map(s => ({start: formatISO(s.start), end: formatISO(s.end)})));
      }

      // --- REFINED LOGIC FOR CALCULATING FREE SLOTS FOR THE DAY ---
      let currentTimePointer = dayWorkingStart;

      if (dayRelevantBusySlots.length === 0) {
          // CASE 1: No busy slots for this day, the entire working period is free
          if (differenceInMinutes(dayWorkingEnd, dayWorkingStart) >= DEFAULT_MIN_SLOT_DURATION_MINUTES) {
              calculatedFreeSlots.push({ start: dayWorkingStart, end: dayWorkingEnd });
              console.log(`[DEBUG FreeCalc] Day: ${currentDayForLog}, NO BUSY SLOTS. Added FULL WORKING DAY as free: ${format(dayWorkingStart, 'ha')} to ${format(dayWorkingEnd, 'ha')}`);
          }
      } else {
          // CASE 2: There are busy slots, find intermittent free periods
          for (const busySlot of dayRelevantBusySlots) {
              const busyEffectiveStartThisDay = max([busySlot.start, dayWorkingStart]);
              const busyEffectiveEndThisDay = min([busySlot.end, dayWorkingEnd]);

              // If there's a gap between currentTimePointer and the start of this busy slot
              if (isBefore(currentTimePointer, busyEffectiveStartThisDay)) {
                  const freeStart = currentTimePointer;
                  const freeEnd = busyEffectiveStartThisDay;
                  if (differenceInMinutes(freeEnd, freeStart) >= DEFAULT_MIN_SLOT_DURATION_MINUTES) {
                      calculatedFreeSlots.push({ start: freeStart, end: freeEnd });
                      console.log(`[DEBUG FreeCalc] Day: ${currentDayForLog}, Added free slot (before busy): ${format(freeStart, 'ha')} to ${format(freeEnd, 'ha')}`);
                  }
              }
              // Advance pointer past the current busy slot
              currentTimePointer = max([currentTimePointer, busyEffectiveEndThisDay]);
              // console.log(`[DEBUG FreeCalc] Day: ${currentDayForLog}, Pointer advanced to: ${format(currentTimePointer, 'ha')} after busy slot ending ${format(busyEffectiveEndThisDay, 'ha')}`);
          }

          // After all busy slots for the day, check for remaining free time until end of working day
          if (isBefore(currentTimePointer, dayWorkingEnd)) {
              if (differenceInMinutes(dayWorkingEnd, currentTimePointer) >= DEFAULT_MIN_SLOT_DURATION_MINUTES) {
                  calculatedFreeSlots.push({ start: currentTimePointer, end: dayWorkingEnd });
                  console.log(`[DEBUG FreeCalc] Day: ${currentDayForLog}, Added final free slot (after last busy): ${format(currentTimePointer, 'ha')} to ${format(dayWorkingEnd, 'ha')}`);
              }
          }
      }
      // --- END REFINED LOGIC ---
    }
    console.log(`${timestamp} Found ${calculatedFreeSlots.length} total free slots.`);

    const desiredDateFormat = 'd MMMM yyyy, ha'; // Format like "26 May 2025, 9AM"
    const desiredTimeFormat = 'ha'; // Format like "9AM"
    const freeSlotsFormatted = calculatedFreeSlots.map(slot => ({
      date: format(slot.start, 'd MMMM yyyy'), // Format like "26 May 2025"
      start: format(slot.start, desiredTimeFormat), // Ensure uppercase AM/PM
      end: format(slot.end, desiredTimeFormat),
    }));

    return new Response(JSON.stringify({ freeSlots: freeSlotsFormatted }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200,
    });

  } catch (error) {
    console.error(`${timestamp} CRITICAL ERROR in GET-FREE-SLOTS function: ${error.message}`, error.stack);
    return new Response(JSON.stringify({ error: error.message || 'An unexpected error occurred.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500,
    });
  }
});