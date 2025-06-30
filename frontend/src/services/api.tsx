// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 60000, // 60 segundos para uploads grandes
});

// Interceptor para logs
api.interceptors.request.use((config) => {
  console.log('🔵 Request:', config.method?.toUpperCase(), config.url);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error:', error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);

export default api;