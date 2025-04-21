import React, { useState } from 'react';
import { Bus, Car, Navigation } from 'lucide-react';
import VehicleSearch from './components/VehicleSearch';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PopularRoutes from './components/PopularRoutes';
import WhyChooseUs from './components/WhyChooseUs';
import VehicleDetails from './components/VehicleDetails';
import Login from './components/Login';
import DriverDashboard from './components/DriverDashboard';
import AdminDashboard from './components/AdminDashboard';
import DriverRegistration from './components/DriverRegistration';

function App() {
  const [selectedTab, setSelectedTab] = useState<'bus' | 'car' | 'auto'>('bus');
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showDriverRegistration, setShowDriverRegistration] = useState(false);
  const [loginType, setLoginType] = useState<'user' | 'driver' | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'user' | 'driver' | 'admin' | null>(null);

  const handleLogin = (type: 'user' | 'driver' | 'admin') => {
    setIsLoggedIn(true);
    setUserType(type);
    setShowLogin(false);
  };

  const handleLoginClick = (type: 'user' | 'driver') => {
    if (type === 'driver') {
      setShowDriverRegistration(true);
    } else {
      setLoginType(type);
      setShowLogin(true);
    }
  };

  if (showDriverRegistration) {
    return <DriverRegistration />;
  }

  if (showLogin) {
    return <Login onLogin={handleLogin} isDriver={loginType === 'driver'} onBack={() => setShowLogin(false)} />;
  }

  if (isLoggedIn) {
    if (userType === 'driver') {
      return <DriverDashboard />;
    }
    if (userType === 'admin') {
      return <AdminDashboard />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLoginClick={handleLoginClick} />
      {!showVehicleDetails && (
        <>
          <Hero />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-lg p-6 -mt-24 relative z-10">
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setSelectedTab('bus')}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    selectedTab === 'bus'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Bus className="w-5 h-5 mr-2" />
                  Bus
                </button>
                <button
                  onClick={() => setSelectedTab('car')}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    selectedTab === 'car'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Car className="w-5 h-5 mr-2" />
                  Car
                </button>
                <button
                  onClick={() => setSelectedTab('auto')}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    selectedTab === 'auto'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Auto
                </button>
              </div>

              <VehicleSearch type={selectedTab} />
            </div>

            <PopularRoutes />
            <WhyChooseUs />
          </main>
        </>
      )}
      
      {showVehicleDetails && <VehicleDetails type={selectedTab} />}

      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => setShowVehicleDetails(!showVehicleDetails)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          {showVehicleDetails ? 'Back to Search' : 'View Vehicle Details'}
        </button>
      </div>
    </div>
  );
}

export default App;