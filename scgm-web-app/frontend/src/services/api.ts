import axios from 'axios';
import { Container, StatusSummary, OptimizedRoute, WasteLevel, AuthResponse, SignInRequest, User, CreateUserRequest } from '../types';

const API_BASE = 'http://localhost:3001';
const AUTH_BASE = 'http://localhost:8081';
const ACCOUNTS_BASE = 'http://localhost:8082';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

const authApi = axios.create({
  baseURL: AUTH_BASE,
  timeout: 10000,
});

const accountsApi = axios.create({
  baseURL: ACCOUNTS_BASE,
  timeout: 10000,
});

// Add auth token to requests
accountsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const containerApi = {
  getAll: (city?: string): Promise<Container[]> => {
    const params = city ? { city } : {};
    return api.get('/containers', { params }).then(res => res.data);
  },
  
  getStatus: (city?: string): Promise<StatusSummary> => {
    const params = city ? { city } : {};
    return api.get('/containers/status', { params }).then(res => res.data);
  },
};

export const routeApi = {
  optimize: (data: {
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    city: string;
    wasteTypes?: WasteLevel[];
  }): Promise<OptimizedRoute> =>
    api.post('/routes/optimize', data).then(res => res.data),
};

export const authService = {
  signIn: (data: SignInRequest): Promise<AuthResponse> =>
    authApi.post('/auth/signin', data).then(res => res.data),
  
  refresh: (refreshToken: string): Promise<AuthResponse> =>
    authApi.post('/auth/refresh', { refreshToken }).then(res => res.data),
  
  logout: (refreshToken: string): Promise<void> =>
    authApi.post('/auth/logout', { refreshToken }).then(res => res.data),
};

export const userApi = {
  getAll: (): Promise<User[]> =>
    accountsApi.get('/accounts').then(res => res.data),
  
  getById: (id: number): Promise<User> =>
    accountsApi.get(`/accounts/${id}`).then(res => res.data),
  
  create: (data: CreateUserRequest): Promise<User> =>
    accountsApi.post('/accounts', data).then(res => res.data),
  
  update: (id: number, data: Partial<CreateUserRequest>): Promise<User> =>
    accountsApi.put(`/accounts/${id}`, data).then(res => res.data),
  
  delete: (id: number): Promise<void> =>
    accountsApi.delete(`/accounts/${id}`).then(res => res.data),
};

export const citiesApi = {
  getAll: () => api.get('/cities').then(res => res.data),
  create: (data: any) => api.post('/cities', data).then(res => res.data),
  update: (id: number, data: any) => api.put(`/cities/${id}`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/cities/${id}`).then(res => res.data),
};