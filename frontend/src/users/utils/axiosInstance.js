import axios from "axios";
import {jwtDecode} from 'jwt-decode';
import dayjs from "dayjs";

const baseUrl = "http://localhost:8000/api/v1";


const createAxiosInstance = () => {
    const instance = axios.create({
        baseURL: baseUrl,
        headers: { 'Content-Type': 'application/json' }
    });

    instance.interceptors.request.use(async req => {
        const token = JSON.parse(localStorage.getItem('access'));
        const refresh_token = JSON.parse(localStorage.getItem('refresh'));

        if (token) {
            const user = jwtDecode(token);
            const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;   

            if (!isExpired) {
                req.headers.Authorization = `Bearer ${token}`;
            } else {
                try {
                    const response = await axios.post(`${baseUrl}/auth/token/refresh/`, { refresh: refresh_token });
                    localStorage.setItem('access', JSON.stringify(response.data.access));
                    req.headers.Authorization = `Bearer ${response.data.access}`;
                } catch (error) {
                    // Handle token refresh error, e.g., by redirecting to login or logging out
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');
                    localStorage.removeItem('user');
                }
            }
        }
        return req;
    }, error => {
        return Promise.reject(error);
    });

    return instance;
};

const axiosInstance = createAxiosInstance();

export default axiosInstance;
