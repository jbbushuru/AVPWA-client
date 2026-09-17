const devmobile = "http://192.168.100.5:5173/api"
const devpc = "http://localhost:5000/api"


export const baseURL: string = import.meta.env.DEV
    ? devpc
    : import.meta.env.VITE_API_URL;