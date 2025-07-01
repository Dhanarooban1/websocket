import PropTypes from 'prop-types';

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-300 border-t-white mx-auto mb-4"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-blue-200 mx-auto animate-ping"></div>
        </div>
        <p className="text-white text-lg font-medium">{message}</p>
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

LoadingScreen.propTypes = {
  message: PropTypes.string
};

export default LoadingScreen;
