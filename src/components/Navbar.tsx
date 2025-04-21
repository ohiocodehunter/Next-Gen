import React from 'react';
import { Bus, User, Phone, HelpCircle, Bell, Gift } from 'lucide-react';

interface NavbarProps {
  onLoginClick: (type: 'user' | 'driver') => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center">
              <Bus className="h-8 w-8 text-red-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Next Gen Transport</span>
            </div>
            
            <div className="hidden md:flex items-center ml-10 space-x-8">
              <a href="#" className="text-gray-700 hover:text-red-600">Bus Tickets</a>
              <a href="#" className="text-gray-700 hover:text-red-600">Cab Rental</a>
              <a href="#" className="text-gray-700 hover:text-red-600">Auto Booking</a>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gray-700 hover:text-red-600">
              <Gift className="h-5 w-5" />
            </button>
            <button className="text-gray-700 hover:text-red-600 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-600 rounded-full text-xs text-white flex items-center justify-center">2</span>
            </button>
            <a href="#" className="flex items-center text-gray-700 hover:text-red-600">
              <Phone className="h-5 w-5 mr-1" />
              Contact
            </a>
            <a href="#" className="flex items-center text-gray-700 hover:text-red-600">
              <HelpCircle className="h-5 w-5 mr-1" />
              Help
            </a>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onLoginClick('user')}
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <User className="h-5 w-5 mr-2" />
                User Login
              </button>
              <button
                onClick={() => onLoginClick('driver')}
                className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Bus className="h-5 w-5 mr-2" />
                Driver Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;