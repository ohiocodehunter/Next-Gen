import React from 'react';
import { Shield, Clock, MapPin, Headphones, Wallet, Award, ThumbsUp, Ticket } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: 'Secure Booking',
      description: 'Bank-grade security for all your transactions with instant confirmation'
    },
    {
      icon: <Clock className="h-8 w-8 text-red-600" />,
      title: 'Real-time Tracking',
      description: 'Track your vehicle location in real-time with live updates'
    },
    {
      icon: <MapPin className="h-8 w-8 text-red-600" />,
      title: 'Wide Coverage',
      description: '10,000+ routes across India with 2000+ transport partners'
    },
    {
      icon: <Headphones className="h-8 w-8 text-red-600" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support in multiple languages'
    },
    {
      icon: <Wallet className="h-8 w-8 text-red-600" />,
      title: 'Best Prices',
      description: 'Guaranteed best fares with exclusive discounts and offers'
    },
    {
      icon: <Award className="h-8 w-8 text-red-600" />,
      title: 'Quality Service',
      description: 'Verified transport partners with high service standards'
    },
    {
      icon: <ThumbsUp className="h-8 w-8 text-red-600" />,
      title: 'Easy Cancellation',
      description: 'Hassle-free cancellation and instant refunds'
    },
    {
      icon: <Ticket className="h-8 w-8 text-red-600" />,
      title: 'Exclusive Benefits',
      description: 'Regular rewards and loyalty programs for frequent travelers'
    }
  ];

  return (
    <section className="mt-16 bg-gray-50 py-12 rounded-2xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Next Gen Transport?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Experience the future of transportation with our innovative platform that puts your comfort and convenience first
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-50 rounded-lg">
                {feature.icon}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{feature.title}</h3>
            <p className="text-gray-600 text-center text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        <div className="inline-flex items-center space-x-8 bg-white px-8 py-4 rounded-xl shadow-md">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">1M+</div>
            <div className="text-sm text-gray-600">Happy Customers</div>
          </div>
          <div className="h-12 w-px bg-gray-200"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">10K+</div>
            <div className="text-sm text-gray-600">Routes</div>
          </div>
          <div className="h-12 w-px bg-gray-200"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">2K+</div>
            <div className="text-sm text-gray-600">Transport Partners</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;