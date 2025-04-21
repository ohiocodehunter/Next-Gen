import React, { useState } from 'react';
import { MapPin, Users, Clock, Calendar, AlertCircle, CheckCircle, Settings, LogOut } from 'lucide-react';

const DriverDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');

  const upcomingTrips = [
    {
      id: 1,
      route: 'Delhi → Jaipur',
      date: '2024-03-25',
      time: '21:00',
      vehicle: 'New Go - DL01AB1234',
      passengers: 32,
      status: 'Starting Soon'
    },
    {
      id: 2,
      route: 'Bareiily → Delhi',
      date: '2024-03-26',
      time: '09:00',
      vehicle: 'Volvo AC Sleeper - UP01AB1234',
      passengers: 28,
      status: 'Scheduled'
    }
  ];

  const completedTrips = [
    {
      id: 3,
      route: 'Mumbai → Pune',
      date: '2024-03-24',
      time: '21:00',
      vehicle: 'New Go - MH01AB1234',
      passengers: 35,
      rating: 4.8
    },
    {
      id: 4,
      route: 'Pune → Mumbai',
      date: '2024-03-24',
      time: '09:00',
      vehicle: 'Volvo AC Sleeper - MH01AB1234',
      passengers: 30,
      rating: 4.9
    },
    {
      id: 5,
      route: 'Bareilly → Shahjahanpur',
      date: '2024-03-24',
      time: '09:00',
      vehicle: 'Zing Bus - MH01AB1234',
      passengers: 30,
      rating: 4.9
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-red-600">JS</span>
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">Welcome, Jai Shankar</h2>
                <p className="text-sm text-gray-500">Driver ID: DRV123456</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <Settings className="h-6 w-6" />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Today's Status</h3>
                <p className="text-2xl font-bold text-green-600">On Time</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Passengers</h3>
                <p className="text-2xl font-bold text-blue-600">125 this week</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Next Trip</h3>
                <p className="text-2xl font-bold text-yellow-600">In 2 hours</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`py-4 px-2 text-sm font-medium border-b-2 ${
                  activeTab === 'upcoming'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Upcoming Trips
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`py-4 px-2 text-sm font-medium border-b-2 ${
                  activeTab === 'completed'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Completed Trips
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'upcoming' ? (
              <div className="space-y-6">
                {upcomingTrips.map((trip) => (
                  <div key={trip.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{trip.route}</h3>
                        <div className="flex items-center text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {trip.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {trip.time}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {trip.passengers} passengers
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{trip.vehicle}</p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        {trip.status}
                      </span>
                    </div>
                    <div className="mt-4 flex space-x-4">
                      <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                        Start Trip
                      </button>
                      <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {completedTrips.map((trip) => (
                  <div key={trip.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{trip.route}</h3>
                        <div className="flex items-center text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {trip.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {trip.time}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {trip.passengers} passengers
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{trip.vehicle}</p>
                      </div>
                      <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-green-800 text-sm font-medium">{trip.rating} ★</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        View Trip Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;