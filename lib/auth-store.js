import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true, // Start with loading true
      isInitialized: false, // Add initialization flag

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await fetch('http://localhost:4000/api/admin/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });

          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          return data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      },

      setLoading: (loading) => set({ isLoading: loading }),

      checkAuth: () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            // Verify the user is an admin
            if (user.user_type === 'admin') {
              set({ 
                token, 
                user,
                isAuthenticated: true,
                isLoading: false,
                isInitialized: true
              });
            } else {
              // Clear invalid data
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                isInitialized: true
              });
            }
          } catch (error) {
            // If user data is corrupted, clear everything
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              isInitialized: true
            });
          }
        } else {
          // No token or user data found
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true
          });
        }
      },

      // Initialize auth state
      initialize: () => {
        const { checkAuth } = get();
        checkAuth();
      },
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
