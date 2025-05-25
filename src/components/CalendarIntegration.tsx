import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Link, Check, Clock, Plus, Minus, Search } from "lucide-react";
import { supabase } from "../../supabaseClient"; // Your configured Supabase client

const STORAGE_KEY = 'datePreferences';

interface CalendarIntegrationProps {
  showErrors: boolean;
}

const CalendarIntegration = ({ showErrors }: CalendarIntegrationProps) => {
  const [selectedOption, setSelectedOption] = useState(0);
  const [manualDate, setManualDate] = useState('');
  const [manualTime, setManualTime] = useState('');

  const [calendarLinks, setCalendarLinks] = useState<string[]>([""]); // Initialize with one empty link

  const [selectedDuration, setSelectedDuration] = useState('');

  const [selectedCommonTime, setSelectedCommonTime] = useState<string>("");
  const [commonTimes, setCommonTimes] = useState<
    { label: string; value: string; date: string; time: string }[]
    >([]);
  
  const addCalendarLink = () => {
    if (calendarLinks.length < 5) {
      setCalendarLinks([...calendarLinks, ""]);
    }
  };

  const removeCalendarLink = (indexToRemove: number) => {
    if (calendarLinks.length > 1) {
      setCalendarLinks(
        calendarLinks.filter((_, index) => index !== indexToRemove)
      );
    }
  };

  const handleCalendarLinkChange = (index: number, value: string) => {
    const newLinks = [...calendarLinks];
    newLinks[index] = value;
    setCalendarLinks(newLinks);
  };

  const handleSearchCommonTimes = async () => {
    try {
      const payload = {
        calendarUrls: calendarLinks,
      };
      console.log(
        "Invoking Supabase function get-free-slots with payload:",
        payload
      );
      const { data, error } = await supabase.functions.invoke(
        "get-free-slots",
        {
          body: payload,
        }
      );

      if (error) {
        console.error("Supabase function invocation error:", error);
        // Handle client-side errors (network, etc.) or Supabase specific errors
        alert(`Error invoking function: ${error.message}`);
        return;
      }

      if (data.error) {
        // This is an error string from our function's JSON response
        console.error("Error from function logic:", data.error);
        alert(`Error from calendar processing: ${data.error}`);
        return;
      }

      console.log("Available free slots:", data.freeSlots);
      const results = data.freeSlots.map((slot) => ({
        label: `${slot.date}: ${slot.start} - ${slot.end}`,
        value: `${slot.date}: ${slot.start} - ${slot.end}`,
        date: `${slot.date}`,
        time: `${slot.start} - ${slot.end}`,
      }));
      setCommonTimes(results);
    } catch (e) {
      console.error("General error:", e);
      alert(`An unexpected error occurred: ${e.message}`);
    }
  };

  // Load saved preferences on component mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem(STORAGE_KEY);
    if (savedPreferences) {
      const { option, date, time, duration } = JSON.parse(savedPreferences);
      setSelectedOption(option || '');
      setManualDate(date || '');
      setManualTime(time || '');
      setSelectedDuration(duration || '');
    }
  }, []);

  // Save preferences whenever they change
  useEffect(() => {
    const preferences = {
      option: selectedOption,
      date: manualDate,
      time: manualTime,
      duration: selectedDuration
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [selectedOption, manualDate, manualTime, selectedDuration]);

  const handleDurationSelect = (value: string) => {
    setSelectedDuration(value);
  };

  const validateDate = () => {
    if (!manualDate) return false;
    const selectedDate = new Date(manualDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  const validateTime = () => {
    if (!manualTime) return false;
    if (!manualDate) return true;
    
    const [hours, minutes] = manualTime.split(':');
    const selectedDateTime = new Date(manualDate);
    selectedDateTime.setHours(parseInt(hours), parseInt(minutes));
    
    const now = new Date();
    return selectedDateTime > now;
  };

  const isFormComplete = () => {
    return (
      selectedDuration &&
      validateDate() &&
      validateTime()
    );
  };

  // Export the validation state to parent component
  useEffect(() => {
    // Store the validation state in localStorage so parent can access it
    localStorage.setItem('calendarValidation', JSON.stringify({
      isComplete: isFormComplete(),
      date: manualDate,
      time: manualTime,
      duration: selectedDuration,
      calendar: selectedOption
    }));
  }, [selectedOption, manualDate, manualTime, selectedDuration]);

  return (
    <div className="space-y-6">
      <Card className="bg-white/70 backdrop-blur-sm border-rose-100">
        <CardHeader>
          <CardTitle className="text-2xl gap-3 text-gray-800 flex items-center space-x-2">
            <Calendar className="h-10 w-10 text-rose-500" />
            <span>When are you planning your date?</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Find common date and time method */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card
              className={`cursor-pointer transition-all duration-200 ${
                selectedOption === 1
                  ? "border-rose-500 bg-rose-50"
                  : "border-gray-200 hover:border-rose-300"
              }`}
              onClick={() => setSelectedOption(1)}
            >
              <CardContent className="p-6 text-center relative">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Link className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Calendar Links</h3>
                <p className="text-sm text-gray-600">
                  Input up to 5 google calendar links. We will find the perfect
                  time across all calendars in the week, starting from today.
                </p>
                {selectedOption === 1 && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-5 w-5 text-rose-500" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all duration-200 ${
                selectedOption === 2
                  ? "border-rose-500 bg-rose-50"
                  : "border-gray-200 hover:border-rose-300"
              }`}
              onClick={() => setSelectedOption(2)}
            >
              <CardContent className="p-6 text-center relative">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Manual</h3>
                <p className="text-sm text-gray-600">
                  Plan and set your date and time manually
                </p>
                {selectedOption === 1 && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-5 w-5 text-rose-500" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Cal link Entry Body */}
          {selectedOption === 1 && (
            <div className="border-y border-gray-200 py-6">
              <div className="space-y-4">
                {calendarLinks.map((link, index) => (
                  <div key={index} className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`calendarLink${index + 1}`}>
                        Calendar Link {index + 1}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id={`calendarLink${index + 1}`}
                          type="url"
                          value={link}
                          onChange={(e) =>
                            handleCalendarLinkChange(index, e.target.value)
                          }
                          className="border-rose-200 focus:border-rose-500"
                          placeholder="Enter calendar link"
                        />
                        <Button
                          type="button"
                          onClick={() => removeCalendarLink(index)}
                          variant="outline"
                          className="px-2"
                          disabled={calendarLinks.length === 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="space-y-4">
                  <Button
                    type="button"
                    onClick={addCalendarLink}
                    disabled={calendarLinks.length >= 5}
                    className="flex items-center gap-2 w-full"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                    Add Calendar Link
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSearchCommonTimes}
                    className="w-full flex items-center gap-2 bg-rose-500 text-white hover:bg-rose-600"
                  >
                    <Search className="h-4 w-4" />
                    Search for Common Times
                  </Button>
                </div>
              </div>
            </div>
          )}

          {commonTimes.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {commonTimes.map((duration) => (
                <Button
                  key={duration.value}
                  value={duration.value}
                  variant="outline"
                  className={`text-wrap h-fit ${selectedCommonTime === duration.value ? 'text-black border-rose-500 bg-rose-50 hover:bg-rose-50' : 'border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300'}`}
                  onClick={() => {
                    setSelectedCommonTime(duration.value);
                    setManualDate(duration.date);
                    setManualTime(duration.time);
                  }}
                >
                  {duration.label}
                </Button>
              ))}
            </div>
          )}

          
      
          {/* Manual Date Entry Body */}
          {selectedOption === 2 && (
            <div className="border-y border-gray-200 py-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
              
                          className={`border-rose-200 focus:border-rose-500 ${
                            showErrors && !validateTime() ? 'border-red-500 bg-red-50' : ''
                          }`}
                        />
                         {showErrors && !validateDate() && (
                  <p className="text-sm text-red-500">Please select a future date</p>
                )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={manualStartTime}
               
                          onChange={(e) => setManualTime(e.target.value)}
                          className={`border-rose-200 focus:border-rose-500 ${
                            showErrors && !validateTime() ? 'border-red-500 bg-red-50' : ''
                          }`}
                          
                        />
                         {showErrors && !validateTime() && (
                  <p className="text-sm text-red-500">Please select a future time</p>
                )}
                </div>
              </div>
            </div>
          )}

          {/* Duration Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">How long should your date be?</h3>
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${
              showErrors && !selectedDuration ? 'ring-2 ring-red-500 rounded-lg p-2' : ''
            }`}>
              {[
                { label: "2-3 hours", value: "2-3" },
                { label: "4-5 hours", value: "4-5" },
                { label: "Half day", value: "half" },
                { label: "Full day", value: "full" },
              ].map((duration) => (
                <Button
                  key={duration.value}
                  variant="outline"
                  onClick={() => handleDurationSelect(duration.value)}
                  className={`relative ${
                    selectedDuration === duration.value
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300'
                  }`}
                >
                  {duration.label}
                  {selectedDuration === duration.value && (
                    <div className="absolute -top-1 -right-1">
                      <div className="bg-rose-500 rounded-full p-1">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  )}
                </Button>
              ))}
            </div>
            {showErrors && !selectedDuration && (
              <p className="text-sm text-red-500">Please select a duration</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarIntegration;
