
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

const LocationPreferences = () => {
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState('10');
  const [transport, setTransport] = useState('');

  const transportOptions = [
    { id: 'walking', label: 'Walking', icon: '🚶‍♀️' },
    { id: 'cycling', label: 'Cycling', icon: '🚴‍♀️' },
    { id: 'public', label: 'Public Transport', icon: '🚊' },
    { id: 'driving', label: 'Driving', icon: '🚗' },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white/70 backdrop-blur-sm border-rose-100">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800 flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-rose-500" />
            <span>Where would you like to go?</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Location Input */}
          <div className="space-y-2">
            <Label htmlFor="location">Starting Location</Label>
            <Input 
              id="location"
              placeholder="Enter your location (e.g., Sydney CBD, Redfern Station)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-rose-200 focus:border-rose-500"
            />
            <p className="text-sm text-gray-600">We'll find great date spots around this area</p>
          </div>

          {/* Radius Selection */}
          <div className="space-y-4">
            <Label>How far are you willing to travel?</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['5km', '10km', '20km', '50km'].map((distance) => (
                <Button
                  key={distance}
                  variant={radius === distance.replace('km', '') ? 'default' : 'outline'}
                  onClick={() => setRadius(distance.replace('km', ''))}
                  className={radius === distance.replace('km', '') 
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600' 
                    : 'border-rose-200 text-rose-600 hover:bg-rose-50'
                  }
                >
                  {distance}
                </Button>
              ))}
            </div>
          </div>

          {/* Transport Method */}
          <div className="space-y-4">
            <Label>Preferred mode of transport</Label>
            <div className="grid md:grid-cols-2 gap-4">
              {transportOptions.map((option) => (
                <Card 
                  key={option.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    transport === option.id 
                      ? 'border-rose-500 bg-rose-50' 
                      : 'border-gray-200 hover:border-rose-300'
                  }`}
                  onClick={() => setTransport(option.id)}
                >
                  <CardContent className="p-4 flex items-center space-x-3">
                    <span className="text-2xl">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div className="space-y-4">
            <Label>Budget per person</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: '$0-50', value: '0-50' },
                { label: '$50-100', value: '50-100' },
                { label: '$100-200', value: '100-200' },
                { label: '$200+', value: '200+' }
              ].map((budget) => (
                <Button
                  key={budget.value}
                  variant="outline"
                  className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
                >
                  {budget.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationPreferences;
