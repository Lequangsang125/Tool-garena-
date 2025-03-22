import axios from "axios"
import { loginFailed, loginStart, loginSuccess, registerFailed, registerStart, registerSuccess } from "./authSlice";

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post('http://localhost:4000/api/auth/login', user);
        dispatch(loginSuccess(res.data));  
        navigate('/');
    } catch (error) {
        console.error("Lỗi đăng nhập:", error.response?.data || error.message);
        dispatch(loginFailed());
    }
};

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
      const res = await axios.post("http://localhost:4000/api/auth/register", user);
      dispatch(registerSuccess(res.data)); // Truyền dữ liệu từ response vào
      navigate("/signin");
    } catch (error) {
      dispatch(registerFailed(error.response?.data?.message || "Đăng ký thất bại!"));
    }
  };