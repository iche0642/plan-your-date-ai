import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Link, Clock, Plus, Minus, Search } from "lucide-react";
import { findCommonFreeTime } from "@/api/calendar";

const CalendarIntegration = () => {
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [manualDate, setManualDate] = useState("");
  const [manualStartTime, setManualStartTime] = useState<string>("");
  const [calendarLinks, setCalendarLinks] = useState<string[]>([""]); // Initialize with one empty link
  const [dateDuration, setDateDuration] = useState<string>("");
const [commonTimes, setCommonTimes] = useState<string[]>([])


  useEffect(() => {
    console.log(manualDate, manualStartTime, dateDuration);
  }, [manualDate, manualStartTime, dateDuration]);

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

  const handleSearchCommonTimes =  async () => {
    // TODO: Implement calendar search functionality
    // const result = await findCommonFreeTime(["https://calendar.google.com/calendar/ical/joditankaiyu2412%40gmail.com/public/basic.ics"]);
    return "2025-05-16 15:15"
  };

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
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Link className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Calendar Links</h3>
                <p className="text-sm text-gray-600">
                  Input up to 5 google calendar links. We will find the perfect time across all
                  calendars in the week.
                </p>
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
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Manual</h3>
                <p className="text-sm text-gray-600">
                  Plan and set your date and time manually
                </p>
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
                    className="border-rose-200 focus:border-rose-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={manualStartTime}
                    onChange={(e) => setManualStartTime(e.target.value)}
                    className="border-rose-200 focus:border-rose-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Duration Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              How long should your date be?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "2-3 hours", value: "2-3" },
                { label: "4-5 hours", value: "4-5" },
                { label: "Half day", value: "half" },
                { label: "Full day", value: "full" },
              ].map((duration) => (
                <Button
                  key={duration.value}
                  variant="outline"
                  className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
                  onChange={() => setDateDuration(duration.value)}

                >
                  {duration.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarIntegration;
