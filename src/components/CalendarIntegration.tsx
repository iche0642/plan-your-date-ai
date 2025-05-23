
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock } from 'lucide-react';

const CalendarIntegration = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [manualDate, setManualDate] = useState('');
  const [manualTime, setManualTime] = useState('');

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
              onClick={() => setSelectedOption('google')}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Google Calendar</h3>
                <p className="text-sm text-gray-600">Sync with your Google Calendar to find the perfect time</p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all duration-200 ${
                selectedOption === 'apple' 
                  ? 'border-rose-500 bg-rose-50' 
                  : 'border-gray-200 hover:border-rose-300'
              }`}
              onClick={() => setSelectedOption('apple')}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Apple Calendar</h3>
                <p className="text-sm text-gray-600">Connect with iCloud Calendar for seamless planning</p>
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
                  className="border-rose-200 focus:border-rose-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input 
                  id="time"
                  type="time" 
                  value={manualTime}
                  onChange={(e) => setManualTime(e.target.value)}
                  className="border-rose-200 focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Duration Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">How long should your date be?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: '2-3 hours', value: '2-3' },
                { label: '4-5 hours', value: '4-5' },
                { label: 'Half day', value: 'half' },
                { label: 'Full day', value: 'full' }
              ].map((duration) => (
                <Button
                  key={duration.value}
                  variant="outline"
                  className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
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
