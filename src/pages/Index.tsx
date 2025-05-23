
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Heart, MapPin, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-rose-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                DateCraft
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/create-date">
                <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50">
                  Browse Plans
                </Button>
              </Link>
              <Link to="/create-date">
                <Button className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700">
                  Create Date Plan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Perfect Dates,
            <br />
            Perfectly Planned
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover and create amazing date experiences with AI-powered planning. 
            From cozy dinner dates to adventure-filled days, we'll help you craft unforgettable moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create-date">
              <Button size="lg" className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-lg px-8 py-6">
                Start Planning
              </Button>
            </Link>
            <Link to="/browse-plans">
              <Button size="lg" variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50 text-lg px-8 py-6">
                Browse Date Ideas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white/70 backdrop-blur-sm border-rose-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Connect Calendar</h3>
                <p className="text-gray-600 text-sm">
                  Sync with Google or Apple Calendar, or set your own availability
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-rose-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Set Preferences</h3>
                <p className="text-gray-600 text-sm">
                  Choose location, transport, activities, and budget preferences
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-rose-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">AI Planning</h3>
                <p className="text-gray-600 text-sm">
                  Our AI creates personalized date plans with curated venues
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-rose-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Book & Enjoy</h3>
                <p className="text-gray-600 text-sm">
                  Customize, book, and enjoy your perfect date experience
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Date Plans */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Popular Date Plans</h2>
            <Link to="/browse-plans">
              <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
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
            ].map((plan, index) => (
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

      {/* Footer */}
      <footer className="bg-white border-t border-rose-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-rose-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
              DateCraft
            </span>
          </div>
          <p className="text-gray-600">Making every moment memorable</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
