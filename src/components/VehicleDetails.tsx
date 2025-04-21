import React from 'react';
import { Star, Shield, Clock, MapPin, Users, CreditCard, Phone, Calendar } from 'lucide-react';
import SeatBooking from './SeatBooking';

interface VehicleDetailsProps {
  type: 'bus' | 'car' | 'auto';
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({ type }) => {
  const vehicleData = {
    bus: {
      name: 'Purple Travels A/C Sleeper',
      rating: 4.8,
      reviews: 2453,
      from: 'Mumbai',
      to: 'Pune',
      departureTime: '21:00',
      arrivalTime: '06:00',
      duration: '9h',
      type: 'Volvo Multi-Axle A/C Sleeper',
      amenities: ['WiFi', 'USB Charging', 'Blanket', 'Reading Light', 'Emergency Contact'],
      policies: [
        'Free cancellation before 12 hours',
        'Partial refund before 6 hours',
        'No refund within 6 hours'
      ]
    },
    car: {
      name: 'Toyota Innova Crysta',
      rating: 4.7,
      reviews: 1289,
      type: 'SUV - 6 Seater',
      amenities: ['AC', 'Music System', 'First Aid Kit', 'GPS Navigation'],
      pricePerKm: 14,
      minKm: 250,
      policies: [
        'Free cancellation before 24 hours',
        '50% refund before 12 hours',
        'No refund within 12 hours'
      ]
    },
    auto: {
      name: 'Premium Auto',
      rating: 4.5,
      reviews: 856,
      type: '3 Seater',
      amenities: ['GPS Tracking', 'Digital Payment', 'Rain Protection'],
      pricePerKm: 8,
      minKm: 2,
      policies: [
        'Free cancellation before 1 hour',
        'No refund within 1 hour'
      ]
    }
  };

  const data = vehicleData[type];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{data.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-1 font-medium">{data.rating}</span>
                <span className="ml-1 text-gray-500">({data.reviews} reviews)</span>
              </div>
              <div className="flex items-center text-green-600">
                <Shield className="h-5 w-5 mr-1" />
                <span>Verified Operator</span>
              </div>
            </div>
          </div>
          {type === 'bus' && (
            <div className="text-right">
              <div className="text-sm text-gray-500">Starting from</div>
              <div className="text-2xl font-bold text-red-600">₹899</div>
            </div>
          )}
        </div>

        {type === 'bus' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-3">
                <div className="text-sm text-gray-500">Duration</div>
                <div className="font-medium">{data.duration}</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-3">
                <div className="text-sm text-gray-500">Departure</div>
                <div className="font-medium">{data.departureTime}</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-3">
                <div className="text-sm text-gray-500">Arrival</div>
                <div className="font-medium">{data.arrivalTime}</div>
              </div>
            </div>
          </div>
        )}

        {(type === 'car' || type === 'auto') && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-3">
                <div className="text-sm text-gray-500">Vehicle Type</div>
                <div className="font-medium">{data.type}</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-3">
                <div className="text-sm text-gray-500">Minimum Distance</div>
                <div className="font-medium">{data.minKm} km</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-3">
                <div className="text-sm text-gray-500">Price per km</div>
                <div className="font-medium">₹{data.pricePerKm}/km</div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {data.amenities.map((amenity, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Cancellation Policy</h3>
          <ul className="space-y-2">
            {data.policies.map((policy, index) => (
              <li key={index} className="flex items-start">
                <span className="h-5 w-5 text-gray-400 mr-2">•</span>
                <span className="text-gray-600">{policy}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {type === 'bus' && <SeatBooking />}

      {(type === 'car' || type === 'auto') && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Book Your Ride</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Location
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter pickup address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Drop Location
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter drop address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
              <button className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors">
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetails;