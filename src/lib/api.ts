import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
});

export const getBackendOrigin = () => {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    return url.replace(/\/api$/, '');
};

export default api;
