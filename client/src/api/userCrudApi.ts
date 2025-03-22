import axios from "axios";

// Cấu hình axios
const API = axios.create({
  baseURL: "http://localhost:4000/api/users", // Chú ý sửa lại "lhttp://localhost" thành "http://localhost"
  withCredentials: true, // Cho phép gửi cookie (JWT nếu có)
});

// 📌 [R] Lấy danh sách User
export const getAllUsers = async () => {
  try {
    const { data } = await API.get("/");
    return data;
  } catch (error) {
    console.error("Lỗi lấy danh sách người dùng:", error);
    throw new Error(error.response?.data?.message || "Lỗi lấy danh sách người dùng");
  }
};

// 📌 [R] Lấy User theo ID
export const getUserById = async (userId) => {
  try {
    const { data } = await API.get(`/${userId}`);
    return data;
  } catch (error) {
    console.error(`Lỗi lấy thông tin người dùng với ID ${userId}:`, error);
    throw new Error(error.response?.data?.message || `Lỗi lấy thông tin người dùng`);
  }
};

// 📌 [R] Lấy User hiện tại từ token
export const getCurrentUser = async () => {
  try {
    const { data } = await API.get("/me");
    return data;
  } catch (error) {
    console.error("Lỗi lấy thông tin người dùng hiện tại:", error);
    throw new Error(error.response?.data?.message || "Lỗi lấy thông tin người dùng hiện tại");
  }
};

// 📌 [U] Cập nhật User
export const updateUser = async ({ userId, userData }) => {
  try {
    const { data } = await API.put(`/${userId}`, userData);
    return data;
  } catch (error) {
    console.error(`Lỗi cập nhật thông tin người dùng với ID ${userId}:`, error);
    throw new Error(error.response?.data?.message || `Lỗi cập nhật thông tin người dùng`);
  }
};

// 📌 [D] Xóa User
export const deleteUser = async (userId) => {
  try {
    const { data } = await API.delete(`/${userId}`);
    return data;
  } catch (error) {
    console.error(`Lỗi xóa người dùng với ID ${userId}:`, error);
    throw new Error(error.response?.data?.message || `Lỗi xóa người dùng`);
  }
};
