import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  Star,
  Users,
  Heart,
  GripHorizontal,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { askGemini } from "@/gemini/gemini";

interface Activity {
  id: number;
  time: string;
  duration: string;
  title: string;
  type: string;
  location: string;
  description: string;
  price: string;
  rating: number | null;
}

interface DatePlan {
  id: number;
  title: string;
  rating: number;
  duration: string;
  activities: Activity[];
}

const datePlans: DatePlan[] = [
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

const ActivityCard = ({
  activity,
  index,
  totalActivities,
  isDragging,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onReplace,
}: {
  activity: Activity;
  index: number;
  totalActivities: number;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onReplace: (activity: Activity) => void;
}) => {
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [alternativeActivities, setAlternativeActivities] = useState([]);
const [isLoadingGemini, setIsLoadingGemini] = useState(false);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    onDragStart(e, index);
  };
  const fetchAlternatives = async (activity) => {
    setIsLoadingGemini(true)
    setShowReplaceModal(true);

    try {
      const result = await askGemini(
        `Find 5 alternative activities for: ${JSON.stringify(
          activity
        )}. Provide details like title, type, location, description, estimated price, and a short reason why it's a good alternative.`
      );
      setAlternativeActivities(result)
      setIsLoadingGemini(false)
      console.log(result);
    } catch (error) {
      setIsLoadingGemini(false)
      console.error("Error fetching alternatives:", error);
    }
  };

  return (
    <>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, index)}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, index)}
        className="flex-1 w-full md:w-auto relative group"
      >
        {/* Horizontal Connection Line */}
        {index < totalActivities - 1 && (
          <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-rose-300"></div>
        )}

        <Card
          className={`relative border-rose-200 transition-all duration-500 ease-in-out cursor-grab active:cursor-grabbing
            ${
              isDragging
                ? "shadow-2xl scale-105 opacity-50 rotate-2"
                : "hover:scale-105 hover:shadow-xl hover:-translate-y-1"
            }`}
        >
          {/* Vertical Connection Line */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-rose-300"></div>

          <CardContent className="p-4">
            {/* Always visible content */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <Badge variant="outline" className="mb-2">
                  {activity.time}
                </Badge>
                <h4 className="font-semibold text-gray-800">
                  {activity.title}
                </h4>
                <p className="text-sm text-gray-600">{activity.type}</p>
              </div>
              {activity.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium">{activity.rating}</span>
                </div>
              )}
            </div>

            {/* Content revealed on hover */}
            <div
              className={`space-y-2 max-h-0 opacity-0 group-hover:max-h-[500px] group-hover:opacity-100 
                transition-all duration-500 ease-in-out delay-100 overflow-hidden
                ${isDragging ? "max-h-0" : ""}`}
            >
              <div className="pt-2 border-t border-rose-100 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span>{activity.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                  <Clock className="h-3 w-3" />
                  <span>{activity.duration}</span>
                </div>
                <p className="text-sm text-gray-700 mt-2">
                  {activity.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-medium text-rose-600">
                    {activity.price}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fetchAlternatives(activity)}
                    className="text-xs border-rose-200 text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200"
                  >
                    Replace
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Replace Modal */}
      <Dialog open={showReplaceModal} onOpenChange={setShowReplaceModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Replace {activity.title}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            {isLoadingGemini && <p>Loading...</p>}
            {alternativeActivities?.map((alt) => (
              <Card
                key={alt.id}
                className="cursor-pointer hover:bg-rose-50 transition-colors duration-200"
                onClick={() => {
                  onReplace(alt);
                  setShowReplaceModal(false);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {alt.title}
                      </h4>
                      <p className="text-sm text-gray-600">{alt.location}</p>
                      <p className="text-sm text-gray-700 mt-1">
                        {alt.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">
                          {alt.rating}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-rose-600 mt-1 block">
                        {alt.price}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const activityTypes = [
  { value: "Restaurant", label: "Restaurant 🍽️" },
  { value: "Cafe", label: "Cafe ☕" },
  { value: "Bar", label: "Bar 🍸" },
  { value: "Activity", label: "Activity 🎯" },
  { value: "Entertainment", label: "Entertainment 🎭" },
  { value: "Outdoor", label: "Outdoor 🌳" },
  { value: "Shopping", label: "Shopping 🛍️" },
  { value: "Transport", label: "Transport 🚗" },
  { value: "Dessert", label: "Dessert 🍰" },
];

const CreateActivityModal = ({
  onCreateActivity,
}: {
  onCreateActivity: (activity: Activity) => void;
}) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newActivity: Activity = {
      id: Date.now(), // Generate a unique ID
      time: "12:00 PM", // This will be adjusted when added to timeline
      title,
      type,
      duration: `${duration} hours`,
      price: `$${price}`,
      location,
      description,
      rating: null, // New activities start without a rating
    };

    onCreateActivity(newActivity);
    setIsOpen(false);

    // Reset form
    setTitle("");
    setType("");
    setDuration("");
    setPrice("");
    setLocation("");
    setDescription("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-rose-200 text-rose-600 hover:bg-rose-50 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Activity
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Activity</DialogTitle>
          <DialogDescription>
            Add a custom activity to your date plan. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Activity Name</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Dinner at Italian Restaurant"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                min="0.5"
                step="0.5"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="1.5"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="25"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Sydney CBD"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the activity"
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700"
            >
              Create Activity
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const DatePlanMindMap = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [activities, setActivities] = useState(datePlans[0].activities);
  const [savedActivities, setSavedActivities] = useState<Activity[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedFromSaved, setDraggedFromSaved] = useState<number | null>(null);

  const handleDragStart = (
    e: React.DragEvent,
    index: number,
    fromSaved: boolean = false
  ) => {
    if (fromSaved) {
      setDraggedFromSaved(index);
    } else {
      setDraggedIndex(index);
    }
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDraggedFromSaved(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: React.DragEvent,
    dropIndex: number,
    toSaved: boolean = false
  ) => {
    e.preventDefault();

    // Handle dropping into saved section
    if (toSaved && draggedIndex !== null) {
      const newActivities = [...activities];
      const [draggedItem] = newActivities.splice(draggedIndex, 1);
      setSavedActivities([...savedActivities, draggedItem]);

      // Update times for remaining activities
      const updatedActivities = updateActivityTimes(newActivities);
      setActivities(updatedActivities);
      setDraggedIndex(null);
      return;
    }

    // Handle dropping from saved section to timeline
    if (draggedFromSaved !== null) {
      const newSavedActivities = [...savedActivities];
      const [draggedItem] = newSavedActivities.splice(draggedFromSaved, 1);
      const newActivities = [...activities];

      // If timeline is empty or dropping at the end, just append
      if (activities.length === 0 || dropIndex >= activities.length) {
        newActivities.push(draggedItem);
      } else {
        newActivities.splice(dropIndex, 0, draggedItem);
      }

      setSavedActivities(newSavedActivities);
      const updatedActivities = updateActivityTimes(newActivities);
      setActivities(updatedActivities);
      setDraggedFromSaved(null);
      return;
    }

    // Handle reordering within timeline
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      const newActivities = [...activities];
      const [draggedItem] = newActivities.splice(draggedIndex, 1);
      newActivities.splice(dropIndex, 0, draggedItem);

      const updatedActivities = updateActivityTimes(newActivities);
      setActivities(updatedActivities);
      setDraggedIndex(null);
    }
  };

  const updateActivityTimes = (activitiesToUpdate: Activity[]) => {
    return activitiesToUpdate.map((item, index) => {
      let baseTime = new Date();
      baseTime.setHours(18, 30, 0); // Starting at 6:30 PM

      if (index > 0) {
        // Add duration of previous activities
        for (let i = 0; i < index; i++) {
          const prevDurationHours = parseFloat(
            activitiesToUpdate[i].duration.split(" ")[0]
          );
          const prevDurationMinutes = prevDurationHours * 60; // Convert hours to minutes
          baseTime.setMinutes(baseTime.getMinutes() + prevDurationMinutes);
        }
      }

      return {
        ...item,
        time: baseTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };
    });
  };

  const handleCreateActivity = (newActivity: Activity) => {
    // Add the new activity directly to saved activities
    setSavedActivities([...savedActivities, newActivity]);
  };

  const handleReplaceActivity = (
    indexToReplace: number,
    replacementActivity: Activity
  ) => {
    const newActivities = [...activities];
    newActivities[indexToReplace] = {
      ...replacementActivity,
      id: activities[indexToReplace].id, // Keep original ID or generate new if needed
      // time will be updated by updateActivityTimes
    };
    const updatedActivities = updateActivityTimes(newActivities);
    setActivities(updatedActivities);
  };

  const currentPlan = datePlans[selectedPlan];
  const totalCost = activities.reduce((sum, activity) => {
    const price = parseFloat(activity.price.replace("$", ""));
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 min-h-screen">
      <Card className="bg-white/80 backdrop-blur-md border-rose-100 shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-rose-500 to-purple-600 p-6">
          <CardTitle className="text-3xl text-white flex items-center space-x-3">
            <Heart className="h-8 w-8" />
            <span>{currentPlan.title}</span>
          </CardTitle>
          <div className="flex items-center space-x-4 text-sm text-rose-100 mt-2">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
              <span className="font-semibold">{currentPlan.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{currentPlan.duration}</span>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white">
              {activities.length} Activities
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              Total: ~${totalCost} per person
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Timeline Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <GripHorizontal className="h-5 w-5 mr-2 text-rose-500" /> Date
              Timeline
            </h3>
            <div
              className="flex flex-col md:flex-row gap-6 md:gap-4 p-4 bg-rose-50/50 rounded-lg border border-rose-200 min-h-[200px] overflow-x-auto custom-scrollbar"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, activities.length)} // Drop at the end if not on specific item
            >
              {activities.map((activity, index) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  index={index}
                  totalActivities={activities.length}
                  isDragging={draggedIndex === index}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onReplace={(newActivity) =>
                    handleReplaceActivity(index, newActivity)
                  }
                />
              ))}
              {activities.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  Drag activities here from the "Saved Activities" section
                  below.
                </div>
              )}
            </div>
          </div>

          {/* Saved Activities Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700 flex items-center">
                <Plus className="h-5 w-5 mr-2 text-rose-500" /> Saved Activities
              </h3>
              <CreateActivityModal onCreateActivity={handleCreateActivity} />
            </div>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-purple-50/50 rounded-lg border border-purple-200 min-h-[150px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, savedActivities.length, true)} // Drop into saved, true indicates it's the saved area
            >
              {savedActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index, true)}
                  onDragEnd={handleDragEnd}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <Card className="border-purple-300 hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <h5 className="font-medium text-gray-700 text-sm">
                        {activity.title}
                      </h5>
                      <p className="text-xs text-gray-500">
                        {activity.type} - {activity.duration}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.location} - {activity.price}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
              {savedActivities.length === 0 && (
                <div className="col-span-full flex items-center justify-center text-gray-400 py-8">
                  Create new activities or drag unwanted activities from the
                  timeline here.
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10 pt-6 border-t border-gray-200">
            <Button
              className="flex-1 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              onClick={() =>
                navigate("/date-confirmation", {
                  state: {
                    activities,
                    planTitle: currentPlan.title,
                    totalCost,
                  },
                })
              }
            >
              Confirm & Finalize Plan (${totalCost})
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-rose-300 text-rose-600 hover:bg-rose-100 hover:border-rose-400 transition-all duration-300"
            >
              Generate New Plan Variation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatePlanMindMap;
