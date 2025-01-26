import axios from 'axios';
import type {
  LoginCredentials,
  CreateUserData,
  UpdateUserData,
  UpdatePasswordData,
  Vehicle,
  Log
} from '@/types/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

// User API
export const userApi = {
  updatePassword: async (userId: string, data: UpdatePasswordData) => {
    const response = await api.put(`/users/${userId}/password`, data);
    return response.data;
  },
};

// Admin API
export const adminApi = {
  // User management
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  getUserById: async (userId: string) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },
  createUser: async (data: CreateUserData) => {
    // Ensure all required fields are included
    const userData = {
      username: data.username,
      password: data.password,
      role: data.role || 'operator',
      status: 'active' // Add status field as required by backend
    };
    console.log('Creating user with data:', userData);
    const response = await api.post('/admin/users', userData);
    return response.data;
  },
  updateUser: async (userId: string, data: UpdateUserData) => {
    const response = await api.put(`/admin/users/${userId}`, data);
    return response.data;
  },
  deleteUser: async (userId: string) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Vehicle management
  getVehicles: async () => {
    const response = await api.get('/vehicle/vehicles');
    return response.data;
  },
  getVehicleById: async (vehicleId: string) => {
    const response = await api.get(`/vehicle/vehicles/${vehicleId}`);
    return response.data;
  },
  createVehicle: async (data: Vehicle) => {
    // Ensure all required fields are included
    const vehicleData = {
      plateNumber: data.plateNumber,
      owner: data.owner,
      status: data.status || 'active',
    };
    console.log('Creating vehicle with data:', vehicleData);
    const response = await api.post('/vehicle/vehicles', vehicleData);
    return response.data;
  },
  updateVehicle: async (vehicleId: string, data: Partial<Vehicle>) => {
    const response = await api.put(`/vehicle/vehicles/${vehicleId}`, data);
    return response.data;
  },
  deleteVehicle: async (vehicleId: string) => {
    const response = await api.delete(`/vehicle/vehicles/${vehicleId}`);
    return response.data;
  },
};

// Logs API
export const logsApi = {
  getLogs: async () => {
    const response = await api.get('/logs', {
      headers: {
        'X-Role': 'admin'
      }
    });
    return response.data;
  },
  getLogById: async (logId: string) => {
    const response = await api.get(`/logs/${logId}`, {
      headers: {
        'X-Role': 'admin'
      }
    });
    return response.data;
  },
  createLog: async (data: Log) => {
    const response = await api.post('/logs', data, {
      headers: {
        'X-Role': 'admin'
      }
    });
    return response.data;
  },
};
