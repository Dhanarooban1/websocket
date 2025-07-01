import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import PropTypes from 'prop-types';

const NotificationSystem = ({ notification, error, onClose }) => {
  if (!notification && !error) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'error':
        return 'bg-red-100 border-red-400 text-red-700';
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700';
      default:
        return 'bg-blue-100 border-blue-400 text-blue-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {notification && (
        <div className={`flex items-center justify-between px-4 py-3 rounded-lg border ${getStyles('info')} mb-2 animate-fade-in`}>
          <div className="flex items-center space-x-2">
            {getIcon('info')}
            <span className="font-medium">{notification}</span>
          </div>
          {onClose && (
            <button onClick={() => onClose('notification')} className="ml-4">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {error && (
        <div className={`flex items-center justify-between px-4 py-3 rounded-lg border ${getStyles('error')} animate-fade-in`}>
          <div className="flex items-center space-x-2">
            {getIcon('error')}
            <span className="font-medium">{error}</span>
          </div>
          {onClose && (
            <button onClick={() => onClose('error')} className="ml-4">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

NotificationSystem.propTypes = {
  notification: PropTypes.string,
  error: PropTypes.string,
  onClose: PropTypes.func
};

export default NotificationSystem;
