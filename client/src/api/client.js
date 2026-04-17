import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' }
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('ecoswap_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 globally — clear token & redirect
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('ecoswap_token');
            // Only redirect if not already on auth pages
            if (!window.location.pathname.match(/\/(login|register)$/)) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
