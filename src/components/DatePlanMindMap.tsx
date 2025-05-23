
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Star, Users, Heart } from 'lucide-react';

const DatePlanMindMap = () => {
  const [selectedPlan, setSelectedPlan] = useState(0);
  
  const datePlans = [
    {
      id: 1,
      title: "Romantic Evening in Redfern",
      rating: 4.8,
      duration: "4-5 hours",
      activities: [
        {
          id: 1,
          time: "6:30 PM",
          duration: "1.5 hours",
          title: "Dinner at Rara Ramen",
          type: "Restaurant",
          location: "Redfern",
          description: "Award-winning ramen in a cozy atmosphere",
          price: "$45",
          rating: 4.7
        },
        {
          id: 2,
          time: "8:00 PM",
          duration: "30 mins",
          title: "Train to Sydney Harbour",
          type: "Transport",
          location: "Redfern → Circular Quay",
          description: "Scenic train ride through the city",
          price: "$4",
          rating: null
        },
        {
          id: 3,
          time: "8:30 PM",
          duration: "1 hour",
          title: "Harbour Walk & Views",
          type: "Activity",
          location: "Circular Quay",
          description: "Romantic walk along the waterfront with Opera House views",
          price: "Free",
          rating: 4.9
        },
        {
          id: 4,
          time: "9:30 PM",
          duration: "1 hour",
          title: "Dessert at Butter Boy",
          type: "Dessert",
          location: "The Rocks",
          description: "Artisanal desserts and coffee",
          price: "$25",
          rating: 4.6
        }
      ]
    }
  ];

  const currentPlan = datePlans[selectedPlan];

  return (
    <div className="space-y-6">
      <Card className="bg-white/70 backdrop-blur-sm border-rose-100">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800 flex items-center space-x-2">
            <Users className="h-6 w-6 text-rose-500" />
            <span>Your AI-Generated Date Plan</span>
          </CardTitle>
          <p className="text-gray-600">Here's a personalized date plan based on your preferences!</p>
        </CardHeader>
        <CardContent>
          {/* Plan Overview */}
          <div className="mb-6 p-4 bg-gradient-to-r from-rose-50 to-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-gray-800">{currentPlan.title}</h3>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{currentPlan.rating}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{currentPlan.duration}</span>
              </div>
              <Badge variant="secondary">4 Activities</Badge>
              <Badge variant="secondary">Total: ~$74 per person</Badge>
            </div>
          </div>

          {/* Mind Map Style Layout */}
          <div className="relative">
            {/* Central Hub */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-rose-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Activities arranged around the center */}
            <div className="grid md:grid-cols-2 gap-6">
              {currentPlan.activities.map((activity, index) => (
                <Card 
                  key={activity.id} 
                  className="relative border-rose-200 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  {/* Connection Line */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-rose-300"></div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Badge variant="outline" className="mb-2">{activity.time}</Badge>
                        <h4 className="font-semibold text-gray-800">{activity.title}</h4>
                        <p className="text-sm text-gray-600">{activity.type}</p>
                      </div>
                      {activity.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium">{activity.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span>{activity.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span>{activity.duration}</span>
                      </div>
                      <p className="text-sm text-gray-700">{activity.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-rose-600">{activity.price}</span>
                        <Button size="sm" variant="outline" className="text-xs border-rose-200 text-rose-600 hover:bg-rose-50">
                          Replace
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
            <Button 
              className="flex-1 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700"
            >
              Book This Plan ($74/person)
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50"
            >
              Customize Plan
            </Button>
            <Button 
              variant="outline" 
              className="border-rose-200 text-rose-600 hover:bg-rose-50"
            >
              Generate New Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatePlanMindMap;
