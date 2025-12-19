/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'agri-green': '#2E7D32',
                'agri-light': '#E8F5E9',
            }
        },
    },
    plugins: [],
}
