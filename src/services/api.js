import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Enhanced request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      if (error.response.status === 401) {
        // Handle unauthorized access
        window.location.href = '/login';
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('API Error: No response received', error.request);
    } else {
      // Something happened in setting up the request
      console.error('API Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API methods with enhanced error handling
export const fetchTrucks = async () => {
  try {
    const response = await api.get('/trucks');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch trucks');
  }
};

export const createShipment = async (shipmentData) => {
  try {
    const response = await api.post('/shipments', shipmentData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create shipment');
  }
};

// Add similar enhanced methods for other endpoints

export default api;