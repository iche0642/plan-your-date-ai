import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Clock, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import CalendarIntegration from '@/components/CalendarIntegration';
import LocationPreferences from '@/components/LocationPreferences';
import ActivityPreferences from '@/components/ActivityPreferences';
import DatePlanMindMap from '@/components/DatePlanMindMap';

const CreateDate = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showCalendarErrors, setShowCalendarErrors] = useState(false);
  const [showLocationErrors, setShowLocationErrors] = useState(false);
  const [preferences, setPreferences] = useState({
    calendar: null,
    location: {},
    activities: [],
    budget: '',
    interests: ''
  });

  const steps = [
    { id: 1, title: 'Calendar', icon: Calendar },
    { id: 2, title: 'Location', icon: MapPin },
    { id: 3, title: 'Preferences', icon: Heart },
    { id: 4, title: 'Plan', icon: Users }
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      // Check calendar validation
      const calendarValidation = JSON.parse(localStorage.getItem('calendarValidation') || '{}');
      if (!calendarValidation.isComplete) {
        setShowCalendarErrors(true);
        return;
      }
      // Update preferences with calendar data
      setPreferences(prev => ({
        ...prev,
        calendar: {
          date: calendarValidation.date,
          time: calendarValidation.time,
          duration: calendarValidation.duration,
          integration: calendarValidation.calendar
        }
      }));
    }

    if (currentStep === 2) {
      // Check location validation
      const locationValidation = JSON.parse(localStorage.getItem('locationValidation') || '{}');
      if (!locationValidation.isComplete) {
        setShowLocationErrors(true);
        return;
      }
      // Update preferences with location data
      setPreferences(prev => ({
        ...prev,
        location: {
          places: locationValidation.locations,
          radius: locationValidation.radius,
          transport: locationValidation.transport,
          budget: locationValidation.budget
        }
      }));
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setShowCalendarErrors(false);
      setShowLocationErrors(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setShowCalendarErrors(false);
      setShowLocationErrors(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-rose-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                DateCraft
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50">
                Save Draft
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center space-x-2 ${isActive ? 'text-rose-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                      ${isActive ? 'border-rose-600 bg-rose-50' : 
                        isCompleted ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="hidden sm:block font-medium">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden sm:block w-16 h-0.5 mx-4 ${isCompleted ? 'bg-green-300' : 'bg-gray-300'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {currentStep === 1 && <CalendarIntegration showErrors={showCalendarErrors} />}
          {currentStep === 2 && <LocationPreferences showErrors={showLocationErrors} />}
          {currentStep === 3 && <ActivityPreferences nextStep={handleNext} />}
          {currentStep === 4 && <DatePlanMindMap />}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={currentStep === 1}
            className="border-rose-200 text-rose-600 hover:bg-rose-50"
          >
            Previous
          </Button>
          {currentStep < 4 && (
            <Button 
              onClick={handleNext} 
              className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateDate;
