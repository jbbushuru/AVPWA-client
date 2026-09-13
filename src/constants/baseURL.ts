const devmobile = "http://172.17.41.93:5000/api"
const devpc = "http://localhost:5000/api"


export const baseURL: string = import.meta.env.DEV
    ? devmobile
    : import.meta.env.VITE_API_URL;