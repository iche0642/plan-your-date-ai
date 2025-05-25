import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Star, Users, Heart, X } from "lucide-react"; // Added X icon
import { askGemini } from "@/gemini/gemini";

const DatePlanMindMap = () => {
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [alternativeActivities, setAlternativeActivities] = useState<any[]>([]); // To store alternatives
  const [isLoadingAlternatives, setIsLoadingAlternatives] = useState(false); // Loading state
  const [selectedActivityForReplacement, setSelectedActivityForReplacement] =
    useState<any>(null);

  const fetchAlternatives = async (activity) => {
    setSelectedActivityForReplacement(activity);
    setIsLoadingAlternatives(true);
    setIsModalVisible(true);
    try {
      const result = await askGemini(
        `Find 3 alternative activities for: ${JSON.stringify(
          activity
        )}. Provide details like title, type, location, description, estimated price, and a short reason why it's a good alternative.`
      );
      // Assuming askGemini returns a string that needs parsing or is an array of alternatives
      // This part might need adjustment based on the actual structure of 'result'
      // For now, let's assume it's a string that we can split into items or a JSON string

      console.log(result);
    } catch (error) {
      console.error("Error fetching alternatives:", error);
    }
  };

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
          rating: 4.7,
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
          rating: null,
        },
        {
          id: 3,
          time: "8:30 PM",
          duration: "1 hour",
          title: "Harbour Walk & Views",
          type: "Activity",
          location: "Circular Quay",
          description:
            "Romantic walk along the waterfront with Opera House views",
          price: "Free",
          rating: 4.9,
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
          rating: 4.6,
        },
      ],
    },
  ];

  const currentPlan = datePlans[selectedPlan];

  return (
    <>
      <div className="space-y-6">
        <Card className="bg-white/70 backdrop-blur-sm border-rose-100">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800 flex items-center space-x-2">
              <Users className="h-6 w-6 text-rose-500" />
              <span>Your AI-Generated Date Plan</span>
            </CardTitle>
            <p className="text-gray-600">
              Here's a personalized date plan based on your preferences!
            </p>
          </CardHeader>
          <CardContent>
            {/* Plan Overview */}
            <div className="mb-6 p-4 bg-gradient-to-r from-rose-50 to-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-800">
                  {currentPlan.title}
                </h3>
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
                          <Badge variant="outline" className="mb-2">
                            {activity.time}
                          </Badge>
                          <h4 className="font-semibold text-gray-800">
                            {activity.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {activity.type}
                          </p>
                        </div>
                        {activity.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-medium">
                              {activity.rating}
                            </span>
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
                        <p className="text-sm text-gray-700">
                          {activity.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-rose-600">
                            {activity.price}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-rose-200 text-rose-600 hover:bg-rose-50"
                            onClick={() => fetchAlternatives(activity)}
                          >
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
              <Button className="flex-1 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700">
                Book This Plan ($74/person)
              </Button>
              {/* <Button 
              variant="outline" 
              className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50"
            >
              Customize Plan
            </Button> */}
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

      {/* Alternative Activities Modal */}
    </>
  );
};

export default DatePlanMindMap;

// Modal for Alternatives
//       {isModalVisible && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-end sm:items-start justify-center z-50 sm:pt-20">
//           <div
//             className={`bg-white p-4 sm:p-6 rounded-t-lg sm:rounded-lg shadow-xl w-full transform transition-all duration-300 ease-out \
//               ${isModalVisible ? 'translate-y-0 opacity-100' : 'translate-y-full sm:-translate-y-full opacity-0'}`}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
//                 Replace: {selectedActivityForReplacement?.title}
//               </h2>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => {
//                   setIsModalVisible(false);
//                   setAlternativeActivities([]); // Clear alternatives when closing
//                   setSelectedActivityForReplacement(null);
//                 }}
//                 className="text-gray-500 hover:text-gray-800"
//               >
//                 <X className="h-5 w-5" />
//               </Button>
//             </div>

//             {isLoadingAlternatives ? (
//               <div className="text-center py-4">
//                 <p className="text-gray-600">Loading alternatives...</p>
//                 {/* You can add a spinner here */}
//               </div>
//             ) : alternativeActivities.length > 0 ? (
//               <div className="space-y-3 sm:space-y-4 max-h-[70vh] sm:max-h-[60vh] overflow-y-auto pr-1 sm:pr-2">
//                 {alternativeActivities.map((alt, index) => (
//                   <Card key={index} className="border-gray-200">
//                     <CardContent className="p-3 sm:p-4">
//                       <h3 className="font-semibold text-gray-700 text-base sm:text-lg">{alt.title || "Alternative"}</h3>
//                       {alt.type && <p className="text-xs sm:text-sm text-gray-500">Type: {alt.type}</p>}
//                       {alt.location && <p className="text-xs sm:text-sm text-gray-500">Location: {alt.location}</p>}
//                       {alt.price && <p className="text-xs sm:text-sm text-gray-500">Price: {alt.price}</p>}
//                       {alt.description && <p className="text-xs sm:text-sm text-gray-600 mt-1">{alt.description}</p>}
//                       {alt.reason && <p className="text-[10px] sm:text-xs text-blue-600 mt-1">Reason: {alt.reason}</p>}
//                       <Button size="sm" variant="outline" className="mt-2 text-xs border-rose-200 text-rose-600 hover:bg-rose-50 w-full sm:w-auto">
//                         Select this
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-600">No alternatives found or an error occurred.</p>
//             )}
//           </div>
//         </div>
//       )}
