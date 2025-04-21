import React, { useState } from 'react';
import { MapPin, Calendar, Search, Users, ChevronDown, Clock, CreditCard } from 'lucide-react';
import { searchRoutes, type SearchParams, type RouteResult } from '../lib/api';
import SearchResults from './SearchResults';
import toast from 'react-hot-toast';
import audioFeedback from '../lib/audio';

interface VehicleSearchProps {
  type: 'bus' | 'car' | 'auto';
}

const VehicleSearch: React.FC<VehicleSearchProps> = ({ type }) => {
  const [passengers, setPassengers] = useState(1);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [acOnly, setAcOnly] = useState(false);
  const [sleeperOnly, setSleeperOnly] = useState(false);
  const [searchResults, setSearchResults] = useState<RouteResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const popularCities = [
    { name: 'Mumbai', routes: 234 },
    { name: 'Delhi', routes: 312 },
    { name: 'Bangalore', routes: 289 },
    { name: 'Chennai', routes: 198 },
    { name: 'Kolkata', routes: 176 },
    { name: 'Hyderabad', routes: 245 },
    { name: 'Pune', routes: 167 },
    { name: 'Ahmedabad', routes: 143 }
  ];

  const vehicleTypes = {
    bus: {
      options: ['AC Seater', 'Non-AC Seater', 'AC Sleeper', 'Non-AC Sleeper'],
      amenities: ['Charging Point', 'Emergency Contact', 'Movie', 'Reading Light', 'Track My Bus']
    },
    car: {
      options: ['Sedan', 'SUV', 'Luxury', 'Electric'],
      amenities: ['AC', 'GPS Tracking', 'Sanitized', 'Professional Driver']
    },
    auto: {
      options: ['Regular', 'Premium'],
      amenities: ['GPS Tracking', 'Digital Payment', 'Safe Ride']
    }
  };

  const calculateFare = (distance: number, baseRate: number, taxRate: number): number => {
    const baseFare = distance * baseRate;
    const tax = baseFare * taxRate;
    return baseFare + tax;
  };

  const handleSearch = async () => {
    if (!source || !destination || !date) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSearching(true);
    try {
      const params: SearchParams = {
        fromCity: source,
        toCity: destination,
        date,
        vehicleType: type,
        passengers
      };

      const results = await searchRoutes(params);
      
      // Calculate fares for each result
      const resultsWithFares = results.map(result => ({
        ...result,
        price: calculateFare(result.estimatedDistance, result.baseRate, result.taxRate)
      }));

      setSearchResults(resultsWithFares);

      if (results.length > 0) {
        const firstResult = results[0];
        audioFeedback.vehicleSelected(
          `${firstResult.vehicle.model}`,
          firstResult.availableSeats,
          firstResult.price
        );
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search routes. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleRouteSelect = (route: RouteResult) => {
    audioFeedback.vehicleSelected(
      route.vehicle.model,
      route.availableSeats,
      route.price
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              onFocus={() => setShowSourceSuggestions(true)}
              placeholder="Enter source"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            {showSourceSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-20 p-2">
                <div className="grid grid-cols-1 gap-1">
                  {popularCities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => {
                        setSource(city.name);
                        setShowSourceSuggestions(false);
                      }}
                      className="flex justify-between items-center px-3 py-2 text-sm text-gray-700 hover:bg-red-50 rounded-md"
                    >
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-red-500" />
                        {city.name}
                      </span>
                      <span className="text-xs text-gray-500">{city.routes} routes</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onFocus={() => setShowDestSuggestions(true)}
              placeholder="Enter destination"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            {showDestSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-20 p-2">
                <div className="grid grid-cols-1 gap-1">
                  {popularCities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => {
                        setDestination(city.name);
                        setShowDestSuggestions(false);
                      }}
                      className="flex justify-between items-center px-3 py-2 text-sm text-gray-700 hover:bg-red-50 rounded-md"
                    >
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-red-500" />
                        {city.name}
                      </span>
                      <span className="text-xs text-gray-500">{city.routes} routes</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {type !== 'bus' && (
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'passenger' : 'passengers'}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {type === 'bus' && (
            <>
              <label className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-red-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acOnly}
                  onChange={(e) => setAcOnly(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">AC buses only</span>
              </label>
              <label className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-red-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sleeperOnly}
                  onChange={(e) => setSleeperOnly(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">Sleeper buses</span>
              </label>
            </>
          )}
          {type !== 'bus' && (
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">Available 24/7</span>
              <span className="mx-2">•</span>
              <CreditCard className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">Pay online or cash</span>
            </div>
          )}
        </div>
        
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full md:w-auto bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Search className="h-5 w-5" />
              <span>Search {type === 'bus' ? 'Buses' : type === 'car' ? 'Cars' : 'Autos'}</span>
            </>
          )}
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="mt-8">
          <SearchResults results={searchResults} onSelect={handleRouteSelect} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Available {type === 'bus' ? 'Bus' : type === 'car' ? 'Car' : 'Auto'} Types</h3>
          <div className="flex flex-wrap gap-2">
            {vehicleTypes[type].options.map((option) => (
              <span key={option} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {option}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {vehicleTypes[type].amenities.map((amenity) => (
              <span key={amenity} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleSearch