import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Calendar, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const DateConfirmation = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/90 via-pink-50/80 to-purple-50/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,228,230,0.6),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(244,214,255,0.6),transparent_40%)]" />
      
      {/* Content */}
      <Card className="relative w-full max-w-lg bg-white/60 backdrop-blur-sm border-rose-100 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-rose-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
            Your Date is Set!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 text-lg">
              Get ready for an amazing experience! We've saved your date plan and you're all set to go.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Calendar className="h-5 w-5 text-rose-500" />
              <span className="text-gray-700">Check your calendar for the details</span>
            </div>
          </div>

          <div className="mt-8">
            <Link to="/">
              <Button 
                className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
              >
                <Home className="h-4 w-4 mr-2" />
                Return Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DateConfirmation; 