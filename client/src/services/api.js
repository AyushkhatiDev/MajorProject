import api from '../utils/axios';

// Listings API
export const listingsApi = {
    getAll: (params) => api.get('/listings', { params }),
    getById: (id) => api.get(`/listings/${id}`),
    create: (data) => api.post('/listings', data),
    update: (id, data) => api.put(`/listings/${id}`, data),
    delete: (id) => api.delete(`/listings/${id}`),
    toggleFavorite: (id) => api.post(`/listings/${id}/favorite`),
    addReview: (id, data) => api.post(`/listings/${id}/reviews`, data),
};

// User API
export const userApi = {
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data) => api.put('/user/profile', data),
    getMyListings: () => api.get('/user/listings'),
    getFavorites: () => api.get('/user/favorites'),
};

// Upload API
export const uploadApi = {
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};
