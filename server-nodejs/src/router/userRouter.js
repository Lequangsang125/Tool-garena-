import express from "express";

import { deleteUser, getAllUsers, getCurrentUser, getUserById, updateUser } from "../controllers/userToolGiaRe/userController.js";
import { verifyToken, verifyTokenAndAdminAuth } from "../middlewares/auth.js";


const userRoutes = express.Router();

userRoutes.get("/",verifyToken , getAllUsers);           // Lấy tất cả user
userRoutes.get("/me",  getCurrentUser); // Lấy user hiện tại
userRoutes.get("/:id", getUserById);         // Lấy user theo ID
userRoutes.put("/:id",verifyToken, updateUser);          // Cập nhật user
userRoutes.delete("/:id",verifyToken, deleteUser);       // Xóa user

export default userRoutes;
