// Test file to verify toast integration
import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';

const TestToast = () => {
  const showTestToast = () => {
    toast.success(
      <div className="flex items-center space-x-2">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <span className="font-medium">Test toast notification!</span>
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

  return (
    <div>
      <button onClick={showTestToast}>Test Toast</button>
      <Toaster position="top-right" />
    </div>
  );
};

export default TestToast;
