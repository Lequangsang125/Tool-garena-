import express from "express";
import { forgotPassword, login, logout, refreshTokenHandler, register } from "../controllers/dangKyDangNhap/authController.js";
import { verifyToken } from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh-token",refreshTokenHandler);
authRouter.post("/logout", logout);
authRouter.post("/forgot-password", forgotPassword);

export default authRouter;
