import axios from "axios"
import { loginFailed, loginStart, loginSuccess, logoutFailed, logoutStart, logoutSuccess, registerFailed, registerStart, registerSuccess } from "./authSlice";
import { deleteUserFailed, deleteUserStart, deleteUserSuccess, getUsersFailed, getUsersStart, getUsersSuccess } from "./userSlice";
import { setBalance } from "./walletSlice";

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, user, { withCredentials: true });

    console.log("🟢 API Response:", res.data);

    dispatch(loginSuccess(res.data));

    if (res.data.balance !== undefined) {
      console.log("cập nhật balance redux:", res.data.balance);
      dispatch(setBalance(res.data.balance));
    } else {
      console.warn("⚠️ API không trả về balance!");
    }

    navigate('/');
    return { success: true, data: res.data }; // ✅ Trả về kết quả thành công
  } catch (error) {
    console.error("🔴 Lỗi đăng nhập:", error);
    console.error("🔴 Lỗi chi tiết:", error.response?.data || error.message);

    dispatch(loginFailed());

    return { success: false, error: error.response?.data?.message || "Đã có lỗi xảy ra" }; // ✅ Trả về lỗi
  }
};


export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, user);
    
    console.log("🟢 Đăng ký thành công:", res.data);

    dispatch(registerSuccess(res.data)); 
    navigate("/signin");

    return { success: true, data: res.data }; // ✅ Trả về kết quả thành công
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Đăng ký thất bại!";
    
    console.error("🔴 Lỗi đăng ký:", errorMsg);
    dispatch(registerFailed(errorMsg));

    return { success: false, error: errorMsg }; // ✅ Trả về lỗi
  }
};


export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
  dispatch(getUsersStart());
  try {
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/api/users`, {
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
    const res = await axiosJWT.delete(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
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
    await axiosJWT.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, id, {
      headers: { 
        token: `Bearer ${accessToken}`,
      },
      withCredentials: true // Gửi cookie cùng với yêu cầu
    });
    localStorage.removeItem('accessToken'); // Xóa token khỏi localStorage (nếu có)
    localStorage.removeItem('refreshToken'); // Xóa refreshToken khỏi localStorage (nếu có)
    dispatch(logoutSuccess());
    navigate('/signin');
  } catch (error) {
    dispatch(logoutFailed());
  }
};