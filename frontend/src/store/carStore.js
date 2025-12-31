import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'https://car-marketplace-app-90q0.onrender.com/api/cars';
axios.defaults.withCredentials = true;

export const useCarStore = create((set) => ({
    cars: [],
    featuredCars: [],
    popularBrands: [],
    currentCar: null,
    userCars: [],
    filters: {
        brand: '',
        model: '',
        minYear: '',
        maxYear: '',
        minPrice: '',
        maxPrice: '',
        transmission: '',
        fuelType: '',
        condition: '',
        location: '',
        sortBy: 'newest'
    },
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCars: 0,
        hasNext: false,
        hasPrev: false
    },
    isLoading: false,
    error: null,

    // Set filters
    setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
    })),

    // Get all cars with filters
    getAllCars: async (page = 1) => {
        set({ isLoading: true, error: null });
        try {
            const state = useCarStore.getState();
            const params = new URLSearchParams();
            
            Object.keys(state.filters).forEach(key => {
                if (state.filters[key]) {
                    params.append(key, state.filters[key]);
                }
            });
            params.append('page', page);
            params.append('limit', 12);

            const response = await axios.get(`${API_URL}?${params.toString()}`);
            set({
                cars: response.data.cars,
                pagination: response.data.pagination,
                isLoading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error fetching cars',
                isLoading: false
            });
        }
    },

    // Get featured cars
    getFeaturedCars: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/featured?limit=10`);
            set({
                featuredCars: response.data.cars,
                isLoading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error fetching featured cars',
                isLoading: false
            });
        }
    },

    // Get popular brands
    getPopularBrands: async () => {
        try {
            const response = await axios.get(`${API_URL}/popular-brands`);
            set({ popularBrands: response.data.brands });
        } catch (error) {
            console.error('Error fetching popular brands:', error);
        }
    },

    // Get single car by ID
    getCarById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            set({
                currentCar: response.data.car,
                isLoading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error fetching car',
                isLoading: false
            });
        }
    },

    // Create car listing
    createCar: async (carData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(API_URL, carData);
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error creating car listing',
                isLoading: false
            });
            throw error;
        }
    },

    // Update car listing
    updateCar: async (id, carData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.put(`${API_URL}/${id}`, carData);
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error updating car listing',
                isLoading: false
            });
            throw error;
        }
    },

    // Delete car listing
    deleteCar: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axios.delete(`${API_URL}/${id}`);
            set({ isLoading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error deleting car listing',
                isLoading: false
            });
            throw error;
        }
    },

    // Get user's cars
    getUserCars: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/user/my-cars`);
            set({
                userCars: response.data.cars,
                isLoading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error fetching user cars',
                isLoading: false
            });
        }
    }
}));

