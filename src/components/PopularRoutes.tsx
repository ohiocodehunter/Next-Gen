import React from 'react';
import { ArrowRight, Star, Users, Clock, Shield, CreditCard, MapPin } from 'lucide-react';

const PopularRoutes = () => {
  const routes = [
    {
      from: 'Mumbai',
      to: 'Pune',
      price: '₹500',
      duration: '3h 30m',
      rating: 4.8,
      reviews: 2453,
      nextAvailable: '10+ buses',
      operators: ['Purple Travels', 'Orange Tours'],
      image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&q=80&w=400',
      amenities: ['AC', 'WiFi', 'Charging Point'],
      departureTime: '06:00 AM',
      arrivalTime: '09:30 AM',
      seatsAvailable: 23,
      discount: '15% OFF'
    },
    {
      from: 'Delhi',
      to: 'Agra',
      price: '₹450',
      duration: '4h 15m',
      rating: 4.6,
      reviews: 1897,
      nextAvailable: '8 buses',
      operators: ['Royal Travels', 'Golden Tours'],
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=400',
      amenities: ['AC', 'Sleeper', 'Snacks'],
      departureTime: '07:30 AM',
      arrivalTime: '11:45 AM',
      seatsAvailable: 15,
      discount: '10% OFF'
    },
    {
      from: 'Bangalore',
      to: 'Mysore',
      price: '₹350',
      duration: '3h 45m',
      rating: 4.7,
      reviews: 3102,
      nextAvailable: '15+ buses',
      operators: ['Green Line', 'City Express'],
      image: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&q=80&w=400',
      amenities: ['AC', 'WiFi', 'Entertainment'],
      departureTime: '08:00 AM',
      arrivalTime: '11:45 AM',
      seatsAvailable: 18,
      discount: '20% OFF'
    },
    {
      from: 'Chennai',
      to: 'Pondicherry',
      price: '₹400',
      duration: '3h',
      rating: 4.5,
      reviews: 1756,
      nextAvailable: '12 buses',
      operators: ['Blue Star', 'Coast Lines'],
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=400',
      amenities: ['AC', 'Charging Point', 'Refreshments'],
      departureTime: '09:00 AM',
      arrivalTime: '12:00 PM',
      seatsAvailable: 30,
      discount: '12% OFF'
    }
  ];

  return (
    <section className="mt-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Popular Routes</h2>
          <p className="text-gray-600">Best deals on most booked routes</p>
        </div>
        <button className="text-red-600 hover:text-red-700 font-medium flex items-center">
          View All Routes
          <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {routes.map((route, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
            <div className="relative">
              <div 
                className="h-40 rounded-t-xl bg-cover bg-center"
                style={{ backgroundImage: `url(${route.image})` }}
              />
              {route.discount && (
                <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {route.discount}
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">{route.rating}</span>
                  <span className="text-sm text-gray-500">({route.reviews})</span>
                </div>
                <span className="text-sm text-green-600 font-medium flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {route.seatsAvailable} seats left
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{route.from}</h3>
                  <p className="text-sm text-gray-500">{route.departureTime}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 mx-2" />
                <div className="flex-1 text-right">
                  <h3 className="font-semibold text-gray-900">{route.to}</h3>
                  <p className="text-sm text-gray-500">{route.arrivalTime}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                  {route.duration}
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-1 text-gray-400" />
                  Verified
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-1 text-gray-400" />
                  Pay Online
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {route.amenities.map((amenity, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {amenity}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs text-gray-500">Starting from</span>
                  <p className="text-lg font-bold text-red-600">{route.price}</p>
                </div>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center">
                  Book Now
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PopularRoutes;