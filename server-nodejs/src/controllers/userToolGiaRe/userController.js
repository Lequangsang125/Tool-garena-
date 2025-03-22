import userModel from "../../models/userModel.js";

// ✅ [R] Lấy danh sách User
export const getAllUsers = async (req, res) => {
    try {
      const users = await userModel.find().select("-password");
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  };
  
  // ✅ [R] Lấy thông tin User theo ID
  export const getUserById = async (req, res) => {
    try {
      const user = await userModel.findById(req.params.id).select("-password");
      if (!user) return res.status(404).json({ message: "User không tồn tại" });
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  };
  
  // ✅ [U] Cập nhật User
  export const updateUser = async (req, res) => {
    try {
      const { username, email } = req.body;
      const updatedUser = await userModel.findByIdAndUpdate(
        req.params.id,
        { username, email },
        { new: true }
      ).select("-password");
  
      if (!updatedUser) return res.status(404).json({ message: "User không tồn tại" });
  
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  };
  
  // ✅ [D] Xóa User
  export const deleteUser = async (req, res) => {
    try {
      const deletedUser = await userModel.findByIdAndDelete(req.params.id);
      if (!deletedUser) return res.status(404).json({ message: "User không tồn tại" });
  
      res.json({ message: "Xóa user thành công" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  };
  
  // ✅ [R] Lấy thông tin User hiện tại (từ token)
  export const getCurrentUser = async (req, res) => {
    try {
      const user = await userModel.findById(req.user.id).select("-password");
      if (!user) return res.status(404).json({ message: "User không tồn tại" });
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  };
  