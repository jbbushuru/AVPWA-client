export const baseURL: string = import.meta.env.DEV
    ? 'http://localhost:5000/api'
    : import.meta.env.VITE_API_URL;