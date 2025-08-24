import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  logout: () => api.post('/api/auth/logout'),
  verifyOtp: (data) => api.post('/api/auth/verify-otp', data),
  resendOtp: (email) => api.post('/api/auth/resend-otp', { email }),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/api/auth/reset-password', data),
};

// Bookings API
export const bookingsAPI = {
  getTodayBookings: () => api.get('/api/bookings/today'),
  searchBookings: (query) => api.get(`/api/bookings/search?q=${encodeURIComponent(query)}`),
  markDone: (id) => api.post(`/api/bookings/${id}/done`),
  markCancelled: (id) => api.post(`/api/bookings/${id}/cancel`),
  markRescheduled: (id) => api.post(`/api/bookings/${id}/reschedule`),
  getAllBookings: () => api.get('/api/bookings/all'),
  getBookingsByDate: (date) => api.get(`/api/bookings/date/${date}`),
  getBookingsByDateRange: (startDate, endDate) => api.get(`/api/bookings/range?start=${startDate}&end=${endDate}`),
};

// Users API
export const usersAPI = {
  getAllUsers: () => api.get('/api/users/all'),
  getUserById: (id) => api.get(`/api/users/${id}`),
  updateUser: (id, data) => api.put(`/api/users/${id}`, data),
  deleteUser: (id) => api.delete(`/api/users/${id}`),
  verifyUser: (id) => api.post(`/api/users/${id}/verify`),
  getUsersByType: (type) => api.get(`/api/users/type/${type}`),
  searchUsers: (query) => api.get(`/api/users/search?q=${encodeURIComponent(query)}`),
};

// Analytics API
export const analyticsAPI = {
  getDashboardStats: () => api.get('/api/analytics/dashboard'),
  getBookingStats: (timeRange = 'week') => api.get(`/api/analytics/bookings?range=${timeRange}`),
  getRevenueStats: (timeRange = 'week') => api.get(`/api/analytics/revenue?range=${timeRange}`),
  getCustomerStats: () => api.get('/api/analytics/customers'),
  getServiceStats: () => api.get('/api/analytics/services'),
  getMonthlyStats: (year) => api.get(`/api/analytics/monthly?year=${year}`),
  getTopServices: () => api.get('/api/analytics/top-services'),
  getCustomerInsights: () => api.get('/api/analytics/customer-insights'),
};

// Admin API
export const adminAPI = {
  registerAdmin: (data) => api.post('/api/admin/register', data),
  getPromos: () => api.get('/api/admin/promos'),
  updatePromo: (id, data) => api.put(`/api/admin/promos/${id}`, data),
  getSystemStats: () => api.get('/api/admin/system-stats'),
  getAdminProfile: () => api.get('/api/admin/profile'),
  updateAdminProfile: (data) => api.put('/api/admin/profile', data),
  changePassword: (data) => api.post('/api/admin/change-password', data),
};

// Settings API
export const settingsAPI = {
  getNotificationSettings: () => api.get('/api/settings/notifications'),
  updateNotificationSettings: (data) => api.put('/api/settings/notifications', data),
  getAppearanceSettings: () => api.get('/api/settings/appearance'),
  updateAppearanceSettings: (data) => api.put('/api/settings/appearance', data),
  getSecuritySettings: () => api.get('/api/settings/security'),
  updateSecuritySettings: (data) => api.put('/api/settings/security', data),
};

export default api;
