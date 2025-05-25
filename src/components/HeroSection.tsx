import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="py-12 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
          Perfect Dates,
          <br />
          Perfectly Planned
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto">
          Discover and create amazing date experiences with AI-powered planning. 
          From cozy dinner dates to adventure-filled days, we'll help you craft unforgettable moments.
        </p>
        <div className="flex justify-center">
          <Link to="/create-date">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 
                text-base sm:text-xl px-6 sm:px-12 py-4 sm:py-8 rounded-lg sm:rounded-xl 
                shadow-xl sm:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="whitespace-nowrap">Start Planning Your Date</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
