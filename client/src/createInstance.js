import axios from 'axios';
import { jwtDecode } from "jwt-decode";


const refreshToken = async () => {
    try {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/refresh-token`,
            {}, // ✅ Không có body, vì token nằm trong cookie
            { withCredentials: true } // ✅ Đặt đúng vị trí
        );

        console.log("access mới và refresh mới", res.data);
        return res.data;
    } catch (error) {
        console.error("Lỗi refresh token:", error.response?.data || error.message);
        throw error; // ✅ Để bắt lỗi rõ hơn
    }
};

export const createAxios = (user, dispatch,stateSuccess) => {
    const newInstance = axios.create();
    newInstance.interceptors.request.use(async (config) => {
        let date = new Date()
        const decodedToken = jwtDecode(user?.accessToken);
        if (decodedToken.exp < date.getTime() / 1000) {
            const data = await refreshToken();
            const refreshUser = {
                ...user,
                accessToken: data.accessToken
            };
            dispatch(stateSuccess(refreshUser));
            config.headers['token'] = 'Bearer ' + data.accessToken;
        }
        return config;
    },
        (err) => {
            return Promise.reject
        }
    );
    return newInstance

}