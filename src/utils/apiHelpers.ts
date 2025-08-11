// Utility functions for API calls and error handling

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Safely parse JSON response, handling non-JSON responses gracefully
 * @param response - Fetch response object
 * @returns Promise<any> - Parsed JSON data
 * @throws Error if response is not JSON or parsing fails
 */
export const safeJsonParse = async (response: Response): Promise<any> => {
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch (error) {
      if (isDevelopment) {
        console.error('Failed to parse JSON:', error);
      }
      throw new Error('Invalid JSON response from server');
    }
  } else {
    // If not JSON, get text content for better error reporting
    const text = await response.text();
    if (isDevelopment) {
      console.error('Non-JSON response received:', text);
    }
    throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`);
  }
};

/**
 * Make a safe API request with proper error handling
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @returns Promise<any> - Parsed response data
 */
export const safeApiRequest = async (url: string, options: RequestInit = {}): Promise<any> => {
  try {
    const response = await fetch(url, options);
    const data = await safeJsonParse(response);
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return data;
  } catch (error) {
    if (isDevelopment) {
      console.error('API Request failed:', error);
    }
    throw error;
  }
};

/**
 * Create standard headers for API requests
 * @param token - Authentication token (optional)
 * @returns Headers object
 */
export const createApiHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};
