import React, { useState } from 'react';
import { Check, X, Info } from 'lucide-react';

interface Seat {
  id: string;
  number: string;
  type: 'seater' | 'sleeper';
  status: 'available' | 'booked' | 'selected';
  price: number;
  deck: 'lower' | 'upper';
}

const SeatBooking: React.FC = () => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  const seats: Seat[] = [
    // Lower Deck Seats
    ...Array(20).fill(null).map((_, i) => ({
      id: `lower-${i + 1}`,
      number: `${i + 1}`,
      type: 'seater',
      status: Math.random() > 0.3 ? 'available' : 'booked',
      price: 500,
      deck: 'lower'
    })),
    // Upper Deck Sleeper Seats
    ...Array(15).fill(null).map((_, i) => ({
      id: `upper-${i + 1}`,
      number: `${i + 21}`,
      type: 'sleeper',
      status: Math.random() > 0.3 ? 'available' : 'booked',
      price: 800,
      deck: 'upper'
    }))
  ];

  const handleSeatClick = (seatId: string) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const totalAmount = selectedSeats.reduce((sum, seatId) => {
    const seat = seats.find(s => s.id === seatId);
    return sum + (seat?.price || 0);
  }, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Select Seats</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span className="text-sm text-gray-600">Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span className="text-sm text-gray-600">Booked</span>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="flex-1">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Lower Deck</h3>
            <div className="grid grid-cols-5 gap-3">
              {seats
                .filter(seat => seat.deck === 'lower')
                .map(seat => (
                  <button
                    key={seat.id}
                    disabled={seat.status === 'booked'}
                    onClick={() => seat.status === 'available' && handleSeatClick(seat.id)}
                    className={`
                      p-2 rounded-lg text-center transition-all
                      ${seat.status === 'booked' 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : selectedSeats.includes(seat.id)
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }
                    `}
                  >
                    <div className="text-sm font-medium">{seat.number}</div>
                    <div className="text-xs">₹{seat.price}</div>
                  </button>
                ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upper Deck (Sleeper)</h3>
            <div className="grid grid-cols-5 gap-3">
              {seats
                .filter(seat => seat.deck === 'upper')
                .map(seat => (
                  <button
                    key={seat.id}
                    disabled={seat.status === 'booked'}
                    onClick={() => seat.status === 'available' && handleSeatClick(seat.id)}
                    className={`
                      p-2 rounded-lg text-center transition-all
                      ${seat.status === 'booked' 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : selectedSeats.includes(seat.id)
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }
                    `}
                  >
                    <div className="text-sm font-medium">{seat.number}</div>
                    <div className="text-xs">₹{seat.price}</div>
                  </button>
                ))}
            </div>
          </div>
        </div>

        <div className="w-80 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Summary</h3>
          {selectedSeats.length > 0 ? (
            <>
              <div className="space-y-3 mb-4">
                {selectedSeats.map(seatId => {
                  const seat = seats.find(s => s.id === seatId);
                  return (
                    <div key={seatId} className="flex justify-between items-center bg-white p-3 rounded-lg">
                      <div>
                        <div className="font-medium">Seat {seat?.number}</div>
                        <div className="text-sm text-gray-500">
                          {seat?.deck.charAt(0).toUpperCase() + seat?.deck.slice(1)} Deck
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{seat?.price}</div>
                        <button 
                          onClick={() => handleSeatClick(seatId)}
                          className="text-red-600 text-sm hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Base Fare</span>
                  <span className="font-medium">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span className="font-medium">₹{Math.round(totalAmount * 0.05)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount</span>
                  <span className="text-red-600">₹{totalAmount + Math.round(totalAmount * 0.05)}</span>
                </div>
              </div>
              <button className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors">
                Proceed to Payment
              </button>
            </>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Info className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>Please select seats to continue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;