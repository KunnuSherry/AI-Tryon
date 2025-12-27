const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Get stored JWT token
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * API client utility
 * Automatically includes Authorization header with JWT token
 */
export const apiClient = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Include cookies
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Auth API functions
 */
export const signup = async (userData) => {
  const response = await apiClient('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  
  // Store token
  if (response.token) {
    localStorage.setItem('token', response.token);
  }
  
  return response;
};

export const login = async (emailOrUsername, password) => {
  const response = await apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ emailOrUsername, password }),
  });
  
  // Store token
  if (response.token) {
    localStorage.setItem('token', response.token);
  }
  
  return response;
};

export const logout = async () => {
  await apiClient('/auth/logout', {
    method: 'POST',
  });
  localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
  return apiClient('/auth/me');
};

/**
 * Seller API functions
 */
export const applySeller = async (sellerData) => {
  return apiClient('/seller/apply', {
    method: 'POST',
    body: JSON.stringify(sellerData),
  });
};

export const getSellerProfile = async () => {
  return apiClient('/seller/profile');
};

/**
 * Admin API functions
 */
export const getPendingSellers = async () => {
  return apiClient('/admin/sellers/pending');
};

export const approveSeller = async (sellerId) => {
  return apiClient(`/admin/sellers/${sellerId}/approve`, {
    method: 'POST',
  });
};

export const rejectSeller = async (sellerId) => {
  return apiClient(`/admin/sellers/${sellerId}/reject`, {
    method: 'POST',
  });
};

