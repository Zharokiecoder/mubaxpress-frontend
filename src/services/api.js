import axios from 'axios';
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
// Wishlist APIs
export const getWishlist = () => API.get('/wishlist');
export const addToWishlist = (productId) => API.post(`/wishlist/${productId}`);
export const removeFromWishlist = (productId) => API.delete(`/wishlist/${productId}`);
export const checkWishlist = (productId) => API.get(`/wishlist/check/${productId}`);


const API = axios.create({
  baseURL: ' https://mubaxpress-backend-1.onrender.com',
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
export const register = (userData) => API.post('/auth/register', userData);
export const login = (credentials) => API.post('/auth/login', credentials);
export const logout = () => API.post('/auth/logout');
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/update-profile', data);

// Product APIs
export const getAllProducts = (params) => API.get('/products', { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const getMyProducts = () => API.get('/products/vendor/my-products');
export const addReview = (id, data) => API.post(`/products/${id}/reviews`, data);

// Message APIs
export const sendMessage = (data) => API.post('/messages', data);
export const getConversation = (userId) => API.get(`/messages/conversation/${userId}`);
export const getAllConversations = () => API.get('/messages/conversations');
export const getUnreadCount = () => API.get('/messages/unread-count');
export const markAsRead = (id) => API.put(`/messages/${id}/read`);
export const deleteMessage = (id) => API.delete(`/messages/${id}`);

// User APIs
export const getAllUsers = (params) => API.get('/users', { params });
export const getUser = (id) => API.get(`/users/${id}`);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deactivateUser = (id) => API.put(`/users/${id}/deactivate`);
export const activateUser = (id) => API.put(`/users/${id}/activate`);
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const getStatistics = () => API.get('/users/admin/statistics');

// Order APIs
export const createOrder = (data) => API.post('/orders', data);
export const initializePayment = (orderId) => API.post(`/orders/${orderId}/pay`);
export const verifyPayment = (reference) => API.get(`/orders/verify/${reference}`);
export const getMyOrders = () => API.get('/orders/my-orders');
export const getOrder = (id) => API.get(`/orders/${id}`);

// Image Upload APIs
export const uploadSingle = (formData) => API.post('/upload/single', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const uploadMultiple = (formData) => API.post('/upload/multiple', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export default API;