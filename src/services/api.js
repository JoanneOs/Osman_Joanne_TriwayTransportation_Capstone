import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Add request interceptor for error handling
api.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed later
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response);
    return Promise.reject(error);
  }
);

// Truck-related API calls
export const fetchTrucks = () => api.get('/trucks');
export const createTruck = (truckData) => api.post('/trucks', truckData);
export const updateTruck = (id, truckData) => api.put(`/trucks/${id}`, truckData);
export const deleteTruck = (id) => api.delete(`/trucks/${id}`);

// Shipment-related API calls
export const fetchShipments = () => api.get('/shipments');
export const createShipment = (shipmentData) => api.post('/shipments', shipmentData);

export default api;