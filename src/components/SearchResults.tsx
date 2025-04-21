import React from 'react';
import { Star, Shield, Clock, MapPin, Users, CreditCard, Navigation } from 'lucide-react';
import type { RouteResult } from '../lib/api';
import { format } from 'date-fns';

interface SearchResultsProps {
  results: RouteResult[];
  onSelect: (route: RouteResult) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onSelect }) => {
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })
      .format(amount);

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">No routes found matching your criteria</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((route) => (
        <div key={route.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h3 className="text-lg font-semibold">
                  {route.fromCity} → {route.toCity}
                </h3>
                <div className="flex items-center text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-1 text-sm">{route.driver.rating.toFixed(1)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {format(new Date(`2000-01-01T${route.departureTime}`), 'hh:mm a')}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {route.duration} • {route.estimatedDistance}km
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {route.availableSeats} seats left
                </div>
              </div>

              {route.highwayRoute && (
                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Navigation className="h-4 w-4 mr-2" />
                    Route: {route.highwayRoute}
                  </div>
                  {route.stops.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {route.stops.map((stop, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {stop}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                  {route.vehicle.model}
                </span>
                {route.vehicle.acAvailable && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    AC
                  </span>
                )}
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500">Fare Breakdown</div>
              <div className="text-sm text-gray-600">
                Base ({formatCurrency(route.baseRate)}/km × {route.estimatedDistance}km)
              </div>
              <div className="text-sm text-gray-600">
                Tax ({(route.taxRate * 100).toFixed(0)}%)
              </div>
              <div className="text-2xl font-bold text-red-600 mt-1">
                {formatCurrency(route.price)}
              </div>
              <button
                onClick={() => onSelect(route)}
                className="mt-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center w-full"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Book Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;