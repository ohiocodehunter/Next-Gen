import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface ApplicationStatus {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  feedback?: string;
  vehicle: {
    type: string;
    model: string;
    registration_number: string;
  };
}

const DriverApplicationStatus = () => {
  const [application, setApplication] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicationStatus();
    subscribeToStatusUpdates();
  }, []);

  const fetchApplicationStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          registration_status,
          created_at,
          updated_at,
          feedback,
          vehicle:vehicles(*)
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setApplication(data);
    } catch (error) {
      console.error('Error fetching application status:', error);
      toast.error('Failed to fetch application status');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToStatusUpdates = () => {
    const { data: { user } } = supabase.auth.getUser();
    if (!user) return;

    const subscription = supabase
      .channel('application-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          setApplication(prev => ({ ...prev, ...payload.new }));
          
          // Show notification for status updates
          if (payload.new.registration_status === 'approved') {
            toast.success('Your application has been approved! 🎉');
          } else if (payload.new.registration_status === 'rejected') {
            toast.error('Your application has been rejected.');
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Application Found</h3>
          <p className="mt-2 text-gray-600">Please submit your driver registration first.</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (application.status) {
      case 'approved':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Clock className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (application.status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Application Status</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
                {getStatusIcon()}
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {application.status === 'approved'
                      ? 'Congratulations! Your application has been approved.'
                      : application.status === 'rejected'
                      ? 'Your application has been rejected.'
                      : 'Your application is under review.'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {application.status === 'pending'
                      ? 'We will notify you once our team reviews your application.'
                      : application.feedback || 'No additional feedback provided.'}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Application Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <div className="flex-shrink-0">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">Application Submitted</p>
                      <p className="text-gray-500">
                        {format(new Date(application.created_at), 'PPpp')}
                      </p>
                    </div>
                  </div>
                  {application.status !== 'pending' && (
                    <div className="flex items-center text-sm">
                      <div className="flex-shrink-0">
                        {application.status === 'approved' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">
                          Application {application.status === 'approved' ? 'Approved' : 'Rejected'}
                        </p>
                        <p className="text-gray-500">
                          {format(new Date(application.updated_at), 'PPpp')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Vehicle Type</p>
                      <p className="text-sm font-medium text-gray-900">
                        {application.vehicle.type.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Model</p>
                      <p className="text-sm font-medium text-gray-900">
                        {application.vehicle.model}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registration Number</p>
                      <p className="text-sm font-medium text-gray-900">
                        {application.vehicle.registration_number}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {application.status === 'approved' && (
                <div className="mt-6">
                  <button
                    onClick={() => {/* Navigate to driver dashboard */}}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    Go to Driver Dashboard
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverApplicationStatus;