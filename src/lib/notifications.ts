import { supabase } from './supabase';
import toast from 'react-hot-toast';

export const sendNotification = async (userId: string, type: 'email' | 'sms', message: string) => {
  try {
    // Store notification in database
    const { error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          type,
          message,
          read: false
        }
      ]);

    if (error) throw error;

    // Show toast notification in UI
    toast.success('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
    toast.error('Failed to send notification');
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

export const getUnreadNotifications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('read', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};