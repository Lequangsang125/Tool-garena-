import axios from "axios"
import { loginFailed, loginStart, loginSuccess, logoutStart, logoutSuccess, registerFailed, registerStart, registerSuccess } from "./authSlice";
import { deleteUserFailed, deleteUserStart, deleteUserSuccess, getUsersFailed, getUsersStart, getUsersSuccess } from "./userSlice";

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post('http://localhost:4000/api/auth/login', user, { withCredentials: true });
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

export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
  dispatch(getUsersStart());
  try {
    const res = await axiosJWT.get("http://localhost:4000/api/users", {
      headers: { token: `Bearer ${accessToken}` } // ✅ Đúng chuẩn header
    });
    console.log("Dữ liệu từ API:", res.data); // ✅ Log API response
    dispatch(getUsersSuccess(res.data));
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    dispatch(getUsersFailed());
  }
};

export const deleteUser = async (accessToken, dispatch, id, axiosJWT) => {
  dispatch(deleteUserStart());
  try {
    const res = await axiosJWT.delete(`http://localhost:4000/api/users/${id}`, {
      headers: { token: `Bearer ${accessToken}` }
    });
    console.log('Dữ liệu sau khi xóa', res.data);
    dispatch(deleteUserSuccess(res.data));
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    dispatch(deleteUserFailed());
  }
}

export const logOut = async (dispatch, id, navigate, accessToken, axiosJWT) => {
  dispatch(logoutStart());
  try {
    await axiosJWT.post('http://localhost:4000/api/auth/logout', id, {
      headers: { 
        token: `Bearer ${accessToken}`,
      },
      withCredentials: true // Gửi cookie cùng với yêu cầu
    });
    dispatch(logoutSuccess());
    localStorage.removeItem('accessToken'); // Xóa token khỏi localStorage (nếu có)
    localStorage.removeItem('refreshToken'); // Xóa refreshToken khỏi localStorage (nếu có)
    navigate('/signin');
  } catch (error) {
    dispatch(loginFailed());
  }
};