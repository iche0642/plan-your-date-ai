import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ActivityPreferencesProps {
  nextStep: () => void;
}

const ActivityPreferences = ({ nextStep }: ActivityPreferencesProps) => {
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const activityCategories = [
    {
      title: 'Food & Dining',
      activities: [
        { id: 'fine-dining', name: 'Fine Dining', emoji: '🍽️' },
        { id: 'casual-dining', name: 'Casual Dining', emoji: '🍕' },
        { id: 'coffee', name: 'Coffee Shops', emoji: '☕' },
        { id: 'dessert', name: 'Desserts', emoji: '🍰' },
        { id: 'food-markets', name: 'Food Markets', emoji: '🥘' },
        { id: 'cooking', name: 'Cooking Classes', emoji: '👨‍🍳' }
      ]
    },
    {
      title: 'Entertainment',
      activities: [
        { id: 'movies', name: 'Movies', emoji: '🎬' },
        { id: 'theater', name: 'Theater', emoji: '🎭' },
        { id: 'live-music', name: 'Live Music', emoji: '🎵' },
        { id: 'comedy', name: 'Comedy Shows', emoji: '😂' },
        { id: 'karaoke', name: 'Karaoke', emoji: '🎤' },
        { id: 'games', name: 'Games & Arcade', emoji: '🎮' }
      ]
    },
    {
      title: 'Outdoor & Active',
      activities: [
        { id: 'hiking', name: 'Hiking', emoji: '🥾' },
        { id: 'beach', name: 'Beach Activities', emoji: '🏖️' },
        { id: 'cycling', name: 'Cycling', emoji: '🚴‍♀️' },
        { id: 'sports', name: 'Sports', emoji: '⚽' },
        { id: 'parks', name: 'Parks & Gardens', emoji: '🌳' },
        { id: 'water-sports', name: 'Water Sports', emoji: '🏄‍♀️' }
      ]
    },
    {
      title: 'Culture & Arts',
      activities: [
        { id: 'museums', name: 'Museums', emoji: '🏛️' },
        { id: 'art-galleries', name: 'Art Galleries', emoji: '🎨' },
        { id: 'history', name: 'Historical Sites', emoji: '🏺' },
        { id: 'workshops', name: 'Art Workshops', emoji: '🖌️' },
        { id: 'photography', name: 'Photography', emoji: '📸' },
        { id: 'architecture', name: 'Architecture Tours', emoji: '🏗️' }
      ]
    }
  ];

  const toggleActivity = (activityId: string) => {
    setSelectedActivities(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const handleAddInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddInterest();
    }
  };

  const removeInterest = (indexToRemove: number) => {
    setInterests(interests.filter((_, index) => index !== indexToRemove));
  };

  const toggleCategory = (categoryTitle: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryTitle)
        ? prev.filter(title => title !== categoryTitle)
        : [...prev, categoryTitle]
    );
  };

  return (
    <div className="space-y-6">
      {/* Interest Input Card */}
      <Card className="bg-white/70 backdrop-blur-sm border-rose-100">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">What interests you for this date?</CardTitle>
          <p className="text-gray-600">Share any specific interests or preferences you have in mind</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="interests">Your interests</Label>
                <Input
                  id="interests"
                  placeholder="e.g., romantic dinner, outdoor activities, art galleries..."
                  className="w-full"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  type="button"
                  onClick={handleAddInterest}
                  className="bg-rose-500 hover:bg-rose-600 text-white"
                  disabled={!interestInput.trim()}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            {/* Display added interests */}
            {interests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-rose-100 text-rose-700 px-3 py-1 rounded-full"
                  >
                    <span className="mr-1">{interest}</span>
                    <button
                      onClick={() => removeInterest(index)}
                      className="ml-1 hover:text-rose-800 focus:outline-none"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Activities Card */}
      <Card className="bg-white/70 backdrop-blur-sm border-rose-100">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800 flex items-center space-x-2">
            <Heart className="h-6 w-6 text-rose-500" />
            <span>What activities do you enjoy?</span>
          </CardTitle>
          <p className="text-gray-600">Select all that interest you - the more you choose, the better we can personalize your date!</p>
        </CardHeader>
        <CardContent className="space-y-8">
          {activityCategories.map((category) => (
            <div key={category.title} className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => toggleCategory(category.title)}
                className="w-full flex justify-between items-center py-2 px-4 hover:bg-rose-50"
              >
                <h3 className="text-lg font-semibold text-gray-800">{category.title}</h3>
                <span className={`transform transition-transform ${
                  expandedCategories.includes(category.title) ? 'rotate-180' : ''
                }`}>
                  ▼
                </span>
              </Button>
              {expandedCategories.includes(category.title) && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {category.activities.map((activity) => (
                    <Card
                      key={activity.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedActivities.includes(activity.id)
                          ? 'border-rose-500 bg-rose-50 scale-105'
                          : 'border-gray-200 hover:border-rose-300 hover:scale-102'
                      }`}
                      onClick={() => toggleActivity(activity.id)}
                    >
                      <CardContent className="p-3 text-center">
                        <div className="text-2xl mb-2">{activity.emoji}</div>
                        <span className="text-sm font-medium">{activity.name}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Skip and Selected Count Section */}
          <div className="space-y-4">
            <div className="text-center">
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                onClick={nextStep}
              >
                Skip preferences and continue →
              </Button>
            </div>

            <div className="text-center p-4 bg-rose-50 rounded-lg">
              <p className="text-rose-700">
                <span className="font-semibold">{selectedActivities.length}</span> activities selected
              </p>
              {selectedActivities.length > 0 && (
                <p className="text-sm text-rose-600 mt-1">
                  Perfect! We'll use these preferences to craft your ideal date plan.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityPreferences;
