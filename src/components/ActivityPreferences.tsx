
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

const ActivityPreferences = () => {
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

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

  return (
    <div className="space-y-6">
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
              <h3 className="text-lg font-semibold text-gray-800">{category.title}</h3>
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
            </div>
          ))}

          {/* Selected Count */}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityPreferences;
