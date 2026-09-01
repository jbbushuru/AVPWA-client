export const baseURL: string = import.meta.env.DEV
  ? "https://avpwa-server.onrender.com/api"
  : import.meta.env.VITE_API_URL;
