// Debug utilities for API testing and troubleshooting

import config from '../config.js';

/**
 * Test API endpoint availability
 * @param endpoint - API endpoint to test
 * @returns Promise<boolean> - Whether endpoint is available
 */
export const testEndpoint = async (endpoint: string): Promise<boolean> => {
  try {
    const response = await fetch(`${config.BASE_URL}${endpoint}`, {
      method: 'HEAD'
    });
    return response.status !== 404;
  } catch (error) {
    console.error(`Failed to test endpoint ${endpoint}:`, error);
    return false;
  }
};

/**
 * Log detailed error information for debugging
 * @param error - Error object or string
 * @param context - Additional context for the error
 */
export const logApiError = (error: any, context: string = '') => {
  if (config.isDevelopment) {
    console.group(`🚨 API Error ${context ? `(${context})` : ''}`);
    console.error('Error:', error);
    console.error('Stack:', error?.stack);
    console.error('Config BASE_URL:', config.BASE_URL);
    console.groupEnd();
  }
};

/**
 * Show user-friendly error message based on error type
 * @param error - Error object
 * @returns User-friendly error message
 */
export const getUserFriendlyError = (error: any): string => {
  if (typeof error === 'string') return error;
  
  if (error?.message?.includes('non-JSON response')) {
    return 'Server is currently unavailable. Please check if the backend service is running.';
  }
  
  if (error?.message?.includes('404')) {
    return 'API endpoint not found. The service may not be properly configured.';
  }
  
  if (error?.message?.includes('Failed to fetch')) {
    return 'Network error. Please check your internet connection.';
  }
  
  return error?.message || 'An unexpected error occurred. Please try again.';
};
