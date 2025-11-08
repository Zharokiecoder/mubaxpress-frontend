import axios from 'axios';

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mubaxpress-backend.onrender.com';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://mubaxpress-backend.onrender.com',
  withCredentials: true
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const register = (userData) => API.post('/api/auth/register', userData);
export const login = (credentials) => API.post('/api/auth/login', credentials);
export const logout = () => API.post('/api/auth/logout');
export const getMe = () => API.get('/api/auth/me');
export const updateProfile = (data) => API.put('/api/auth/update-profile', data);

// Product APIs
export const getAllProducts = (params) => API.get('/api/products', { params });
export const getProduct = (id) => API.get(`/api/products/${id}`);
export const createProduct = (data) => API.post('/api/products', data);
export const updateProduct = (id, data) => API.put(`/api/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/api/products/${id}`);
export const getMyProducts = () => API.get('/api/products/vendor/my-products');
export const addReview = (id, data) => API.post(`/api/products/${id}/reviews`, data);

// Message APIs
export const sendMessage = (data) => API.post('/api/messages', data);
export const getConversation = (userId) => API.get(`/api/messages/conversation/${userId}`);
export const getAllConversations = () => API.get('/api/messages/conversations');
export const getUnreadCount = () => API.get('/api/messages/unread-count');
export const markAsRead = (id) => API.put(`/api/messages/${id}/read`);
export const deleteMessage = (id) => API.delete(`/api/messages/${id}`);

// User APIs
export const getAllUsers = (params) => API.get('/api/users', { params });
export const getUser = (id) => API.get(`/api/users/${id}`);
export const updateUser = (id, data) => API.put(`/api/users/${id}`, data);
export const deactivateUser = (id) => API.put(`/api/users/${id}/deactivate`);
export const activateUser = (id) => API.put(`/api/users/${id}/activate`);
export const deleteUser = (id) => API.delete(`/api/users/${id}`);
export const getStatistics = () => API.get('/api/users/admin/statistics');

// Order APIs
export const createOrder = (data) => API.post('/api/orders', data);
export const initializePayment = (orderId) => API.post(`/api/orders/${orderId}/pay`);
export const verifyPayment = (reference) => API.get(`/api/orders/verify/${reference}`);
export const getMyOrders = () => API.get('/api/orders/my-orders');
export const getOrder = (id) => API.get(`/api/orders/${id}`);

// Wishlist APIs
export const getWishlist = () => API.get('/api/wishlist');
export const addToWishlist = (productId) => API.post(`/api/wishlist/${productId}`);
export const removeFromWishlist = (productId) => API.delete(`/api/wishlist/${productId}`);
export const checkWishlist = (productId) => API.get(`/api/wishlist/check/${productId}`);

// Image Upload APIs
export const uploadSingle = (formData) => API.post('/api/upload/single', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const uploadMultiple = (formData) => API.post('/api/upload/multiple', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export default API;