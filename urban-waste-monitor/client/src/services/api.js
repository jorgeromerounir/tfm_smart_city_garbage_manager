import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const containerService = {
  // Get all containers
  getAll: () => api.get('/containers'),
  
  // Get specific container
  getById: (id) => api.get(`/containers/${id}`),
  
  // Get container history
  getHistory: (id, hours = 24) => api.get(`/containers/${id}/history?hours=${hours}`),
};

export const routeService = {
  // Get optimized route
  optimize: (startLat, startLon, priority = 'heavy', levels = 'medium,heavy') => 
    api.get(`/routes/optimize?startLat=${startLat}&startLon=${startLon}&priority=${priority}&levels=${levels}`),
};

export default api;