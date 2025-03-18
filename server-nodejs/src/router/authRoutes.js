import express from "express";
import {getPrelogin, login, loginAndGetSkin } from "../controllers/authController.js";


const authRouter = express.Router();

// Định nghĩa route POST /auth/login
authRouter.post("/login",login);
authRouter.post("/login-getskin",loginAndGetSkin);


export default authRouter;
