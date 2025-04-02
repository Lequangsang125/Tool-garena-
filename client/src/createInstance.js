import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const refreshToken = async () => {
    try {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/refresh-token`,
            {}, // Không có body, vì token nằm trong cookie
            { withCredentials: true } // Đặt đúng vị trí
        );
        console.log("access mới và refresh mới", res.data);
        return res.data;
    } catch (error) {
        console.error("Lỗi refresh token:", error.response?.data || error.message);
        throw error; // Để bắt lỗi rõ hơn
    }
};

export const createAxios = (user, dispatch, stateSuccess, logoutUser) => {
    const newInstance = axios.create();
    
    newInstance.interceptors.request.use(async (config) => {
        let date = new Date();
        const decodedToken = jwtDecode(user?.accessToken);

        if (decodedToken.exp < date.getTime() / 1000) {
            try {
                const data = await refreshToken();
                const refreshUser = {
                    ...user,
                    accessToken: data.accessToken
                };
                dispatch(stateSuccess(refreshUser)); // Cập nhật state với accessToken mới
                config.headers['token'] = 'Bearer ' + data.accessToken; // Cập nhật header với accessToken mới
            } catch (error) {
                console.error("Không thể refresh token. Đăng xuất...");
                logoutUser(); // Gọi hàm đăng xuất nếu không refresh được token
                return Promise.reject("Token hết hạn, yêu cầu đăng nhập lại!");
            }
        } else {
            config.headers['token'] = 'Bearer ' + user.accessToken; // Nếu token còn hạn, giữ nguyên
        }

        return config;
    },
    (err) => {
        return Promise.reject(err);
    });

    return newInstance;
};
