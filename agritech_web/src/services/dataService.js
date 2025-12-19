import Papa from 'papaparse';

const USERS_KEY = 'agritech_users';
const CURRENT_USER_KEY = 'user_session';

export const dataService = {
    // User Management
    registerUser: (userData) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        // Simple check if user exists by name (mock)
        if (users.find(u => u.name === userData.name)) {
            return { success: false, message: 'User already exists' };
        }
        const newUser = { ...userData, id: Date.now().toString() };
        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        // Auto login
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
        return { success: true };
    },

    loginUser: (name, password) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const user = users.find(u => u.name === name && u.password === password);
        if (user) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
            return { success: true };
        }
        return { success: false, message: 'Invalid credentials' };
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    },

    logout: () => {
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    // Mandi Data
    getMandiData: async () => {
        try {
            const response = await fetch('/mandi_data.csv');
            const csvText = await response.text();
            return new Promise((resolve) => {
                Papa.parse(csvText, {
                    header: true,
                    dynamicTyping: true,
                    complete: (results) => {
                        resolve(results.data);
                    }
                });
            });
        } catch (error) {
            console.error('Error loading CSV:', error);
            return [];
        }
    }
};
