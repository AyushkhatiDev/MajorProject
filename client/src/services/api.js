import api from '../utils/axios';

// Listings API
export const listingsApi = {
    getAll: (params) => api.get('/listings', { params }),
    getById: (id) => api.get(`/listings/${id}`),
    create: (data) => {
        const formData = new FormData();
        // Handle listing data
        Object.keys(data.listing).forEach(key => {
            formData.append(`listing[${key}]`, data.listing[key]);
        });
        // Handle image
        if (data.image) {
            formData.append('listing[image]', data.image);
        }
        return api.post('/listings', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    update: (id, data) => {
        const formData = new FormData();
        // Handle listing data
        Object.keys(data.listing).forEach(key => {
            formData.append(`listing[${key}]`, data.listing[key]);
        });
        // Handle image
        if (data.image) {
            formData.append('listing[image]', data.image);
        }
        return api.put(`/listings/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    delete: (id) => api.delete(`/listings/${id}`),
    addReview: (id, data) => api.post(`/listings/${id}/reviews`, data),
};

// Auth API
export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    getCurrentUser: () => api.get('/auth/me'),
};

// User API
export const userApi = {
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'avatar' && data[key]) {
                formData.append('avatar', data[key]);
            } else {
                formData.append(key, data[key]);
            }
        });
        return api.put('/user/profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    getMyListings: () => api.get('/user/listings'),
    getFavorites: () => api.get('/user/favorites'),
};

// Reviews API
export const reviewsApi = {
    create: (listingId, data) => api.post(`/listings/${listingId}/reviews`, data),
    update: (listingId, reviewId, data) => api.put(`/listings/${listingId}/reviews/${reviewId}`, data),
    delete: (listingId, reviewId) => api.delete(`/listings/${listingId}/reviews/${reviewId}`),
};
