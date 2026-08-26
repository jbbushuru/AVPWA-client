export const baseURL: string = import.meta.env.DEV
    ? 'http://192.168.1.45:5000/api'
    : import.meta.env.VITE_API_URL;