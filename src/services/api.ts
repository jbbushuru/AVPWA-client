import axios from 'axios';
import { baseURL } from '../constants/baseURL';

// Create central Axios instance
export const api = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Crucial for sending/receiving HTTP-only refresh cookies
});

// Helper functions to manage short-lived access token in memory
let inMemoryAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = () => inMemoryAccessToken;

// 1. REQUEST INTERCEPTOR: Attach Bearer token to every outgoing request
api.interceptors.request.use(
  (config) => {
    if (inMemoryAccessToken && config.headers) {
      config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. RESPONSE INTERCEPTOR: Handle 401 Unauthorized & Silent Refresh
const MAX_RETRIES = 2;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Attach clean message directly to the error object
    if (error.response?.data?.message) {
      error.customMessage = error.response.data.message;
    }

    const originalRequest = error.config;

    // 1. Never attempt to refresh if the failed request was login, register, or refresh-token
    const isAuthEndpoint =
      originalRequest.url?.includes('/refresh-token') ||
      originalRequest.url?.includes('/login') ||
      originalRequest.url?.includes('/register');

    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    // Initialize retry counter
    originalRequest._retryCount = originalRequest._retryCount || 0;

    // 2. Check for 401 and make sure we haven't hit MAX_RETRIES
    if (error.response?.status === 401 && originalRequest._retryCount < MAX_RETRIES) {
      originalRequest._retryCount += 1;

      try {
        // Attempt silent refresh
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = data.accessToken;
        setAccessToken(newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed (token expired/invalid) -> Nuke session & redirect
        setAccessToken(null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);