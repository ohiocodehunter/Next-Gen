import { supabase } from './supabase';
import { format } from 'date-fns';

export interface SearchParams {
  fromCity: string;
  toCity: string;
  date: string;
  vehicleType: 'bus' | 'car' | 'auto';
  passengers: number;
}

export interface RouteResult {
  id: string;
  fromCity: string;
  toCity: string;
  vehicleType: string;
  price: number;
  departureTime: string;
  duration: string;
  availableSeats: number;
  estimatedDistance: number;
  baseRate: number;
  taxRate: number;
  highwayRoute?: string;
  stops: string[];
  vehicle: {
    id: string;
    model: string;
    registrationNumber: string;
    acAvailable: boolean;
  };
  driver: {
    id: string;
    name: string;
    rating: number;
  };
}

// Dummy data for testing
const dummyRoutes: RouteResult[] = [
  {
    id: 'bus-b205',
    fromCity: 'Bareilly',
    toCity: 'Shahjahanpur',
    vehicleType: 'bus',
    price: 700,
    departureTime: '09:00',
    duration: '6h',
    availableSeats: 32,
    estimatedDistance: 150,
    baseRate: 4,
    taxRate: 0.12,
    highwayRoute: 'NH530',
    stops: ['Bareilly Junction', 'Tilhar', 'Shahjahanpur City'],
    vehicle: {
      id: 'v1',
      model: 'Volvo AC Sleeper',
      registrationNumber: 'UP25 BT 5678',
      acAvailable: true
    },
    driver: {
      id: 'd1',
      name: 'Rajesh Kumar',
      rating: 4.8
    }
  },
  // Add more dummy routes here...
];

export const searchRoutes = async (params: SearchParams): Promise<RouteResult[]> => {
  // For testing, return dummy data
  return dummyRoutes.filter(route => 
    route.fromCity.toLowerCase() === params.fromCity.toLowerCase() &&
    route.toCity.toLowerCase() === params.toCity.toLowerCase() &&
    route.vehicleType === params.vehicleType &&
    route.availableSeats >= params.passengers
  );
};