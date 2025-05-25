import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Check } from 'lucide-react';

const STORAGE_KEY = 'datePreferences';

interface CalendarIntegrationProps {
  showErrors: boolean;
}

const CalendarIntegration = ({ showErrors }: CalendarIntegrationProps) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [manualDate, setManualDate] = useState('');
  const [manualTime, setManualTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');

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

  const handleCalendarSelect = (option: string) => {
    setSelectedOption(selectedOption === option ? '' : option);
  };

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
          <CardTitle className="text-2xl text-gray-800 flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-rose-500" />
            <span>When are you planning your date?</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Calendar Integration Options */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer transition-all duration-200 ${
                selectedOption === 'google' 
                  ? 'border-rose-500 bg-rose-50' 
                  : 'border-gray-200 hover:border-rose-300'
              }`}
              onClick={() => handleCalendarSelect('google')}
            >
              <CardContent className="p-6 text-center relative">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Google Calendar</h3>
                <p className="text-sm text-gray-600">Sync with your Google Calendar to find the perfect time</p>
                {selectedOption === 'google' && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-5 w-5 text-rose-500" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all duration-200 ${
                selectedOption === 'apple' 
                  ? 'border-rose-500 bg-rose-50' 
                  : 'border-gray-200 hover:border-rose-300'
              }`}
              onClick={() => handleCalendarSelect('apple')}
            >
              <CardContent className="p-6 text-center relative">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Apple Calendar</h3>
                <p className="text-sm text-gray-600">Connect with iCloud Calendar for seamless planning</p>
                {selectedOption === 'apple' && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-5 w-5 text-rose-500" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Manual Date Entry */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Or set your date manually</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date"
                  type="date" 
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className={`border-rose-200 focus:border-rose-500 ${
                    showErrors && !validateDate() ? 'border-red-500 bg-red-50' : ''
                  }`}
                />
                {showErrors && !validateDate() && (
                  <p className="text-sm text-red-500">Please select a future date</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input 
                  id="time"
                  type="time" 
                  value={manualTime}
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

          {/* Duration Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">How long should your date be?</h3>
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${
              showErrors && !selectedDuration ? 'ring-2 ring-red-500 rounded-lg p-2' : ''
            }`}>
              {[
                { label: '2-3 hours', value: '2-3' },
                { label: '4-5 hours', value: '4-5' },
                { label: 'Half day', value: 'half' },
                { label: 'Full day', value: 'full' }
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
