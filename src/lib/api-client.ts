import axios from 'axios';
import { tokenManager } from './token-manager';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// 1. Cria uma instância do Axios
const apiClient = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// 2. Interceptor de REQUEST (Adiciona o Access Token)
apiClient.interceptors.request.use(async (config) => {
    const token = await tokenManager.getToken();

    if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// 3. Interceptor de RESPONSE (Captura token de login/register/googleAuth)
apiClient.interceptors.response.use((response) => {

    if (
        response.config.url?.includes('/login') ||
        response.config.url?.includes('/register') ||
        response.config.url?.includes('/googleAuth')
    ) {
        const newToken = response.data.data?.token;
        if (newToken) {
            tokenManager.setToken(newToken);
        }
    }

    return response;
}, (error) => {
    return Promise.reject(error);
});

export { apiClient };