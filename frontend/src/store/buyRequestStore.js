import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'https://car-marketplace-app-90q0.onrender.com/api/buy-requests';
axios.defaults.withCredentials = true;

export const useBuyRequestStore = create((set) => ({
    sellerRequests: [],
    buyerRequests: [],
    isLoading: false,
    error: null,

    // Create buy request
    createBuyRequest: async (carId, message = '') => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(API_URL, { carId, message });
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error creating buy request',
                isLoading: false
            });
            throw error;
        }
    },

    // Get seller requests
    getSellerRequests: async (status = '') => {
        set({ isLoading: true, error: null });
        try {
            const params = status ? `?status=${status}` : '';
            const response = await axios.get(`${API_URL}/seller${params}`);
            set({
                sellerRequests: response.data.requests,
                isLoading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error fetching seller requests',
                isLoading: false
            });
        }
    },

    // Get buyer requests
    getBuyerRequests: async (status = '') => {
        set({ isLoading: true, error: null });
        try {
            const params = status ? `?status=${status}` : '';
            const response = await axios.get(`${API_URL}/buyer${params}`);
            set({
                buyerRequests: response.data.requests,
                isLoading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error fetching buyer requests',
                isLoading: false
            });
        }
    },

    // Accept buy request
    acceptBuyRequest: async (requestId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.put(`${API_URL}/${requestId}/accept`);
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error accepting buy request',
                isLoading: false
            });
            throw error;
        }
    },

    // Decline buy request
    declineBuyRequest: async (requestId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.put(`${API_URL}/${requestId}/decline`);
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error declining buy request',
                isLoading: false
            });
            throw error;
        }
    }
}));

