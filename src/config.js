// Configuration file for the application

const config = {
  // Base URL for the backend API
  BASE_URL: 'https://wehack-teamamigos-backend.onrender.com',
  
  // API endpoints configuration
  API_ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/v1/auth/login',
      REGISTER: '/api/v1/auth/register',
      LOGOUT: '/api/v1/auth/logout'
    },
    USER: {
      PROFILE: '/api/v1/citizen/profile'
    },
    LAWYER: {
      PROFILE: '/api/v1/lawyer/profile'
    }
  },
  
  // Development mode flag
  isDevelopment: process.env.NODE_ENV === 'development'
};

export default config;
