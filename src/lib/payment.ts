import { loadScript } from '@razorpay/checkout-js';
import { supabase } from './supabase';
import toast from 'react-hot-toast';

interface PaymentOptions {
  amount: number;
  currency?: string;
  bookingId: string;
  userEmail: string;
  userName: string;
  description: string;
}

export const initializePayment = async (options: PaymentOptions) => {
  try {
    // Load Razorpay script
    await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    // Create order on your backend
    const { data: order, error: orderError } = await supabase
      .functions.invoke('create-razorpay-order', {
        body: {
          amount: options.amount,
          currency: options.currency || 'INR',
          bookingId: options.bookingId
        }
      });

    if (orderError) throw orderError;

    // Initialize Razorpay options
    const razorpayOptions = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: options.amount,
      currency: options.currency || 'INR',
      name: 'Next Gen Transport',
      description: options.description,
      order_id: order.id,
      handler: async (response: any) => {
        try {
          // Verify payment on your backend
          const { error: verifyError } = await supabase
            .functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: options.bookingId
              }
            });

          if (verifyError) throw verifyError;

          // Update booking status
          const { error: bookingError } = await supabase
            .from('bookings')
            .update({ status: 'confirmed', payment_status: 'paid' })
            .eq('id', options.bookingId);

          if (bookingError) throw bookingError;

          toast.success('Payment successful! Booking confirmed.');
          return true;
        } catch (error) {
          console.error('Payment verification failed:', error);
          toast.error('Payment verification failed. Please contact support.');
          return false;
        }
      },
      prefill: {
        email: options.userEmail,
        name: options.userName
      },
      theme: {
        color: '#E11D48'
      }
    };

    // Create Razorpay instance
    const razorpay = new (window as any).Razorpay(razorpayOptions);
    razorpay.open();

    return new Promise((resolve) => {
      razorpay.on('payment.success', () => resolve(true));
      razorpay.on('payment.error', () => resolve(false));
    });
  } catch (error) {
    console.error('Payment initialization failed:', error);
    toast.error('Failed to initialize payment. Please try again.');
    return false;
  }
};