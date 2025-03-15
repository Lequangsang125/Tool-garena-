import express from "express";
import {  getAccountInfo, getLogin, getPrelogin } from "../controllers/authController.js";


const router = express.Router();

// Định nghĩa route POST /auth/login
router.post("/login",getLogin);
router.post("/prelogin",getPrelogin);
router.post("/getAccountInfo",getAccountInfo);


export default router;
