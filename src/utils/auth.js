// utils/auth.js

export const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

export const setAuthToken = (token) => {
  localStorage.setItem('adminToken', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('adminToken');
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    // Vérifier si le token n'est pas expiré (optionnel)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp && payload.exp < currentTime) {
      removeAuthToken();
      return false;
    }
    
    return true;
  } catch (error) {
    removeAuthToken();
    return false;
  }
};

export const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No token available');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (response.status === 401 || response.status === 403) {
    removeAuthToken();
    throw new Error('Unauthorized');
  }

  return response;
};