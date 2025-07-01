import { useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import PropTypes from 'prop-types';

const NotificationSystem = ({ notification, error, onClose }) => {
  const lastNotificationRef = useRef('');
  const lastErrorRef = useRef('');

  useEffect(() => {
    if (notification && notification !== lastNotificationRef.current) {
      lastNotificationRef.current = notification;
      
      // Dismiss all previous toasts before showing new one
      toast.dismiss();
      
      toast.success(
        <div className="flex items-center space-x-2">
          <Info className="w-5 h-5 text-blue-600" />
          <span className="font-medium">{notification}</span>
        </div>,
        {
          duration: 3000,
          style: {
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1d4ed8',
          },
        }
      );
      
      // Auto-close after showing toast
      setTimeout(() => {
        if (onClose) onClose('notification');
        lastNotificationRef.current = '';
      }, 3000);
    }
  }, [notification, onClose]);

  useEffect(() => {
    if (error && error !== lastErrorRef.current) {
      lastErrorRef.current = error;
      
      // Dismiss all previous toasts before showing new one
      toast.dismiss();
      
      toast.error(
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="font-medium">{error}</span>
        </div>,
        {
          duration: 5000,
          style: {
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
          },
        }
      );
      
      // Auto-close after showing toast
      setTimeout(() => {
        if (onClose) onClose('error');
        lastErrorRef.current = '';
      }, 5000);
    }
  }, [error, onClose]);

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#ffffff',
          color: '#374151',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          padding: '12px 16px',
          fontSize: '14px',
          maxWidth: '400px',
        },
      }}
    />
  );
};

// Static method for showing success toasts from other components
let lastStaticToast = '';
let lastStaticToastTime = 0;

NotificationSystem.showSuccess = (message) => {
  const now = Date.now();
  
  // Prevent duplicate toasts within 1 second
  if (message === lastStaticToast && (now - lastStaticToastTime) < 1000) {
    return;
  }
  
  lastStaticToast = message;
  lastStaticToastTime = now;
  
  toast.success(
    <div className="flex items-center space-x-2">
      <CheckCircle className="w-5 h-5 text-green-600" />
      <span className="font-medium">{message}</span>
    </div>,
    {
      duration: 2000,
      style: {
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        color: '#166534',
      },
    }
  );
};

NotificationSystem.propTypes = {
  notification: PropTypes.string,
  error: PropTypes.string,
  onClose: PropTypes.func
};

export default NotificationSystem;
