import React from 'react';
import { Shield, Star, MapPin } from 'lucide-react';

const Hero = () => {
  return (
    <div 
      className="relative h-[500px] bg-cover bg-center"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1920")'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black to-black/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                <Shield className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-sm">Trusted by 1M+ travelers</span>
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                <Star className="h-5 w-5 text-yellow-400 mr-2" />
                <span className="text-sm">4.8/5 rating</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Your Journey,<br />Our Priority
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Book buses, cars, and autos with real-time tracking across 10,000+ routes in India
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-red-500 mr-2" />
                <span>100+ cities</span>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-red-500 mr-2" />
                <span>Secure payments</span>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="flex items-center">
                <Star className="h-6 w-6 text-red-500 mr-2" />
                <span>Best prices</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;