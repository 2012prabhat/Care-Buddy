import axios from "axios";

const url = "http://localhost:9090"
const BASE_URL = `${url}/api`;

// Create Axios instance
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Include cookies in cross-origin requests
});

// Track whether a token refresh request is in progress
let isRefreshing = false;
let refreshSubscribers = [];

// Notify all subscribers with the refreshed token
const onRefreshed = (token) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
};

// Add a callback to the subscribers list
const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

// Request Interceptor: Add Authorization Header
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle Unauthorized (401) or Forbidden (403) errors for non-retry requests
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    // Refresh the token
                    const { data } = await axios.post(
                        `${BASE_URL}/auth/refresh`,
                        {},
                        { withCredentials: true }
                    );

                    // Update access token
                    localStorage.setItem('accessToken', data.accessToken);
                    console.log('token refreshed')
                    onRefreshed(data.accessToken); // Notify all subscribers with the new token

                    isRefreshing = false;
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);

                    isRefreshing = false;

                    // Clear tokens and redirect to login
                    localStorage.removeItem('accessToken');
                    if (window.location.pathname !== '/login' 
                        &&  window.location.pathname !== '/signup'
                        &&  window.location.pathname !== '/verify') {
                        window.location.href = '/login'; // Redirect only if not on the login page
                    }
                    return Promise.reject(refreshError);
                }
            }

            // Wait for the token refresh process to complete
            return new Promise((resolve, reject) => {
                addRefreshSubscriber((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    resolve(api(originalRequest)); // Retry the original request
                });
            });
        }

        return Promise.reject(error);
    }
);

export default api;
