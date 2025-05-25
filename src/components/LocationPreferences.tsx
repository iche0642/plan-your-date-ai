import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, X, Check } from 'lucide-react';

const MAX_LOCATIONS = 1;
const STORAGE_KEY = 'locationPreferences';

interface LocationPreferencesProps {
  showErrors: boolean;
}

const LocationPreferences = ({ showErrors }: LocationPreferencesProps) => {
  const [location, setLocation] = useState('');
  const [savedLocations, setSavedLocations] = useState<string[]>(() => {
    const stored = localStorage.getItem('savedLocation');
    return stored ? JSON.parse(stored) : [];
  });
  const [radius, setRadius] = useState('10');
  const [transport, setTransport] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');

  // Load saved preferences
  useEffect(() => {
    const savedPreferences = localStorage.getItem(STORAGE_KEY);
    if (savedPreferences) {
      const { radius: savedRadius, transport: savedTransport, budget: savedBudget } = JSON.parse(savedPreferences);
      setRadius(savedRadius || '10');
      setTransport(savedTransport || '');
      setSelectedBudget(savedBudget || '');
    }
  }, []);

  // Save preferences whenever they change
  useEffect(() => {
    const preferences = {
      locations: savedLocations,
      radius,
      transport,
      budget: selectedBudget
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));

    // Export validation state for parent component
    localStorage.setItem('locationValidation', JSON.stringify({
      isComplete: isFormComplete(),
      ...preferences
    }));
  }, [savedLocations, radius, transport, selectedBudget]);

  const handleLocationSubmit = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e && e.key !== 'Enter') {
      return;
    }

    if (location.trim()) {
      const newLocation = location.trim();
      
      if (savedLocations.includes(newLocation)) {
        return;
      }

      if (savedLocations.length >= 1) {
        return;
      }

      setSavedLocations([newLocation]);
      setLocation('');
    }
  };

  const removeLocation = (locationToRemove: string) => {
    setSavedLocations(savedLocations.filter(loc => loc !== locationToRemove));
  };

  const transportOptions = [
    { id: 'walking', label: 'Walking', icon: '🚶‍♀️' },
    { id: 'cycling', label: 'Cycling', icon: '🚴‍♀️' },
    { id: 'public', label: 'Public Transport', icon: '🚊' },
    { id: 'driving', label: 'Driving', icon: '🚗' },
  ];

  const budgetOptions = [
    { label: '$0-50', value: '0-50' },
    { label: '$50-100', value: '50-100' },
    { label: '$100-200', value: '100-200' },
    { label: '$200+', value: '200+' }
  ];

  const isFormComplete = () => {
    return (
      savedLocations.length > 0 &&
      radius &&
      transport &&
      selectedBudget
    );
  };

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
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input 
                  id="location"
                  placeholder={savedLocations.length >= 1 ? "Remove current location to add new one" : "Enter your location (e.g., Sydney CBD, Redfern Station)"}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={handleLocationSubmit}
                  className={`border-rose-200 focus:border-rose-500 ${
                    showErrors && savedLocations.length === 0 ? 'border-red-500 bg-red-50' : ''
                  }`}
                  disabled={savedLocations.length >= 1}
                />
                <Button
                  onClick={() => handleLocationSubmit()}
                  disabled={!location.trim() || savedLocations.length >= 1}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 transition-all duration-300"
                >
                  Save
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {savedLocations.map((savedLocation, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="font-medium">{savedLocation}</span>
                    <button
                      onClick={() => removeLocation(savedLocation)}
                      className="ml-3 hover:bg-white/20 p-1 rounded-full transition-colors duration-200 focus:outline-none"
                      aria-label="Remove location"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              {showErrors && savedLocations.length === 0 && (
                <p className="text-sm text-red-500">Please enter a location</p>
              )}
            </div>
          </div>

          {/* Radius Selection */}
          <div className="space-y-4">
            <Label>How far are you willing to travel?</Label>
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${
              showErrors && !radius ? 'ring-2 ring-red-500 rounded-lg p-2' : ''
            }`}>
              {['5km', '10km', '20km', '50km'].map((distance) => (
                <Button
                  key={distance}
                  variant={radius === distance.replace('km', '') ? 'default' : 'outline'}
                  onClick={() => setRadius(distance.replace('km', ''))}
                  className={radius === distance.replace('km', '') 
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white' 
                    : 'border-rose-200 text-rose-600 hover:bg-rose-50'
                  }
                >
                  {distance}
                </Button>
              ))}
            </div>
            {showErrors && !radius && (
              <p className="text-sm text-red-500">Please select a travel radius</p>
            )}
          </div>

          {/* Transport Method */}
          <div className="space-y-4">
            <Label>Preferred mode of transport</Label>
            <div className={`grid md:grid-cols-2 gap-4 ${
              showErrors && !transport ? 'ring-2 ring-red-500 rounded-lg p-2' : ''
            }`}>
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
                    {transport === option.id && (
                      <Check className="h-4 w-4 ml-auto text-rose-500" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {showErrors && !transport && (
              <p className="text-sm text-red-500">Please select a transport method</p>
            )}
          </div>

          {/* Budget Range */}
          <div className="space-y-4">
            <Label>Budget per person</Label>
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${
              showErrors && !selectedBudget ? 'ring-2 ring-red-500 rounded-lg p-2' : ''
            }`}>
              {budgetOptions.map((budget) => (
                <Button
                  key={budget.value}
                  variant="outline"
                  onClick={() => setSelectedBudget(budget.value)}
                  className={`relative ${
                    selectedBudget === budget.value
                      ? 'border-rose-500 bg-rose-50 hover:bg-rose-50 text-rose-700'
                      : 'border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300'
                  }`}
                >
                  {budget.label}
                  {selectedBudget === budget.value && (
                    <div className="absolute -top-1 -right-1">
                      <div className="bg-rose-500 rounded-full p-1">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  )}
                </Button>
              ))}
            </div>
            {showErrors && !selectedBudget && (
              <p className="text-sm text-red-500">Please select a budget range</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationPreferences;
