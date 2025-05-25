import ICAL from 'ical.js';

interface TimeSlot {
  start: Date;
  end: Date;
}

// Helper function to parse ICS data and extract events
function getEventsFromICS(icsData: string, startDate: Date, endDate: Date): TimeSlot[] {
  const jcalData = ICAL.parse(icsData);
  const component = new ICAL.Component(jcalData);
  const vevents = component.getAllSubcomponents('vevent');
  const busySlots: TimeSlot[] = [];

  vevents.forEach(vevent => {
    const event = new ICAL.Event(vevent);
    const eventStartDate = event.startDate.toJSDate();
    const eventEndDate = event.endDate.toJSDate();

    // Consider events that overlap with our desired range [startDate, endDate]
    if (eventEndDate > startDate && eventStartDate < endDate) {
      busySlots.push({
        start: eventStartDate > startDate ? eventStartDate : startDate,
        end: eventEndDate < endDate ? eventEndDate : endDate,
      });
    }

    // Handle recurring events if necessary (simplified for now)
    // ICAL.js has event.iterator() for recurring events, which can be complex.
    // For this example, we'll focus on non-recurring or fully expanded events.
    // If you need full recurrence support, the logic here would need to be expanded significantly.
  });

  // Sort busy slots by start time
  busySlots.sort((a, b) => a.start.getTime() - b.start.getTime());

  // Merge overlapping or contiguous busy slots
  const mergedBusySlots: TimeSlot[] = [];
  if (busySlots.length > 0) {
    let currentSlot = { ...busySlots[0] };
    for (let i = 1; i < busySlots.length; i++) {
      if (busySlots[i].start <= currentSlot.end) {
        currentSlot.end = new Date(Math.max(currentSlot.end.getTime(), busySlots[i].end.getTime()));
      } else {
        mergedBusySlots.push(currentSlot);
        currentSlot = { ...busySlots[i] };
      }
    }
    mergedBusySlots.push(currentSlot);
  }
  return mergedBusySlots;
}

// Helper function to get free slots from busy slots within a day range and time window
function getFreeSlots(busySlots: TimeSlot[], dayStart: Date, dayEnd: Date, minHour: number, maxHour: number): TimeSlot[] {
  const freeSlots: TimeSlot[] = [];
  let lastBusyEnd = new Date(dayStart);
  lastBusyEnd.setHours(minHour, 0, 0, 0);

  // Ensure dayEnd is also within the min/max hour for the last day's check
  const overallEndTime = new Date(dayEnd);
  overallEndTime.setHours(maxHour, 0, 0, 0);

  for (const busy of busySlots) {
    // Ensure busy slot is within the overall time window we care about
    const busyStartInWindow = busy.start > lastBusyEnd ? busy.start : lastBusyEnd;
    const busyEndInWindow = busy.end < overallEndTime ? busy.end : overallEndTime;

    if (busyStartInWindow < busyEndInWindow && busyStartInWindow < overallEndTime && busyEndInWindow > lastBusyEnd) {
        if (busyStartInWindow > lastBusyEnd) {
            // Check if the free slot is within the 9 AM - 10 PM window for its specific day
            const slotStart = new Date(lastBusyEnd);
            const slotEnd = new Date(busyStartInWindow);

            // Iterate through days within this potential free slot
            let currentDayPointer = new Date(slotStart);
            while(currentDayPointer < slotEnd) {
                const dayStartTime = new Date(currentDayPointer);
                dayStartTime.setHours(minHour, 0, 0, 0);
                const dayEndTime = new Date(currentDayPointer);
                dayEndTime.setHours(maxHour, 0, 0, 0);

                const effectiveFreeStart = slotStart > dayStartTime ? slotStart : dayStartTime;
                const effectiveFreeEnd = slotEnd < dayEndTime ? slotEnd : dayEndTime;

                if (effectiveFreeStart < effectiveFreeEnd) {
                    freeSlots.push({ start: new Date(effectiveFreeStart), end: new Date(effectiveFreeEnd) });
                }
                currentDayPointer.setDate(currentDayPointer.getDate() + 1);
                currentDayPointer.setHours(0,0,0,0); // Reset to start of next day
            }
        }
        lastBusyEnd = new Date(Math.max(lastBusyEnd.getTime(), busyEndInWindow.getTime()));
    }
  }

  // Add final free slot if any, from last busy period to end of overall window
  if (lastBusyEnd < overallEndTime) {
        let currentDayPointer = new Date(lastBusyEnd);
        while(currentDayPointer < overallEndTime) {
            const dayStartTime = new Date(currentDayPointer);
            dayStartTime.setHours(minHour, 0, 0, 0);
            const dayEndTime = new Date(currentDayPointer);
            dayEndTime.setHours(maxHour, 0, 0, 0);

            const effectiveFreeStart = lastBusyEnd > dayStartTime ? lastBusyEnd : dayStartTime;
            const effectiveFreeEnd = overallEndTime < dayEndTime ? overallEndTime : dayEndTime;

            if (effectiveFreeStart < effectiveFreeEnd) {
                freeSlots.push({ start: new Date(effectiveFreeStart), end: new Date(effectiveFreeEnd) });
            }
            currentDayPointer.setDate(currentDayPointer.getDate() + 1);
            currentDayPointer.setHours(0,0,0,0); // Reset to start of next day
        }
  }
  return freeSlots;
}

// Helper function to intersect two lists of time slots
function intersectFreeSlots(slots1: TimeSlot[], slots2: TimeSlot[]): TimeSlot[] {
  const intersection: TimeSlot[] = [];
  let i = 0, j = 0;

  while (i < slots1.length && j < slots2.length) {
    const s1 = slots1[i];
    const s2 = slots2[j];

    const overlapStart = new Date(Math.max(s1.start.getTime(), s2.start.getTime()));
    const overlapEnd = new Date(Math.min(s1.end.getTime(), s2.end.getTime()));

    if (overlapStart < overlapEnd) {
      intersection.push({ start: overlapStart, end: overlapEnd });
    }

    // Move pointer for the slot that ends earlier
    if (s1.end < s2.end) {
      i++;
    } else {
      j++;
    }
  }
  return intersection;
}

export async function findCommonFreeTime(icsUrls: string[]): Promise<TimeSlot[]> {
  if (!icsUrls || icsUrls.length === 0) {
    return [];
  }

  const today = new Date();
  const startDate = new Date(today);
  startDate.setHours(0, 0, 0, 0); // Start of today

  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 7);
  endDate.setHours(23, 59, 59, 999); // End of 7 days from today

  const minHour = 9; // 9 AM
  const maxHour = 22; // 10 PM

  let commonSlots: TimeSlot[] | null = null;

  for (const url of icsUrls) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Failed to fetch ICS from ${url}: ${response.statusText}`);
        continue; // Skip this calendar
      }
      const icsData = await response.text();
      const busySlots = getEventsFromICS(icsData, startDate, endDate);
      const calendarFreeSlots = getFreeSlots(busySlots, startDate, endDate, minHour, maxHour);

      if (commonSlots === null) {
        commonSlots = calendarFreeSlots;
      } else {
        commonSlots = intersectFreeSlots(commonSlots, calendarFreeSlots);
      }

      // If at any point commonSlots becomes empty, no need to process further
      if (commonSlots.length === 0) {
        break;
      }

    } catch (error) {
      console.error(`Error processing ICS from ${url}:`, error);
      // If one calendar fails, we might want to return empty or exclude it.
      // For now, if any calendar fails critically, we'll likely end up with no common slots.
      return []; // Or handle more gracefully
    }
  }

  return commonSlots || [];
}

// Example Usage (for testing in Node.js environment or similar):
/*
async function test() {
  const calendarLinks = [
    // Replace with actual public ICS URLs for testing
    // e.g., 'https://calendar.google.com/calendar/ical/.../public/basic.ics',
    //       'https://outlook.office365.com/owa/calendar/.../calendar.ics'
  ];
  if (calendarLinks.length > 0) {
      const commonTimes = await findCommonFreeTime(calendarLinks);
      console.log("Common Free Times:");
      commonTimes.forEach(slot => {
        console.log(`From: ${slot.start.toLocaleString()} To: ${slot.end.toLocaleString()}`);
      });
  } else {
      console.log("Please provide ICS links for testing.");
  }
}

test();
*/