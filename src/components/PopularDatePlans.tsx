
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const PopularDatePlans = () => {
  const datePlans = [
    {
      title: "Romantic Downtown Evening",
      rating: 4.8,
      reviews: 156,
      activities: ["Dinner at Rara Ramen", "Harbour Walk", "Dessert at Butter Boy"],
      image: "bg-gradient-to-br from-rose-400 to-pink-600"
    },
    {
      title: "Adventure & Coffee",
      rating: 4.9,
      reviews: 203,
      activities: ["Rock Climbing", "Artisan Coffee", "Art Gallery"],
      image: "bg-gradient-to-br from-emerald-400 to-teal-600"
    },
    {
      title: "Foodie Experience",
      rating: 4.7,
      reviews: 89,
      activities: ["Food Market", "Cooking Class", "Wine Tasting"],
      image: "bg-gradient-to-br from-amber-400 to-orange-600"
    }
  ];

  return (
    <section className="py-16 px-4 bg-white/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Popular Date Plans</h2>
          <Link to="/create-date">
            <Button className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700">
              Create Your Own
            </Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {datePlans.map((plan, index) => (
            <Card key={index} className="bg-white border-rose-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className={`h-48 ${plan.image} rounded-t-lg flex items-center justify-center`}>
                <h3 className="text-white text-xl font-semibold text-center px-4">{plan.title}</h3>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{plan.rating}</span>
                    <span className="text-gray-600 text-sm">({plan.reviews})</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {plan.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                      <span className="text-gray-700 text-sm">{activity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDatePlans;
