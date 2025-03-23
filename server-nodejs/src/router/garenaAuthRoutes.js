import express from "express";
import { loginAndGetSkin, loginGarena } from "../controllers/autoLoginGarena/functionMain.js";
import { spamAccGarena } from "../controllers/spamAccGarena/spamAccController.js";
import verifyRecaptcha from "../middlewares/recaptchaMiddleware.js";
import { verifyToken } from "../middlewares/auth.js";


const garenaAuthRouter = express.Router();

// Định nghĩa route POST /auth/login
garenaAuthRouter.post("/login-garena",verifyRecaptcha, loginGarena);
garenaAuthRouter.post("/login-getskin",verifyRecaptcha,loginAndGetSkin);
garenaAuthRouter.post("/spam-garena",spamAccGarena);


export default garenaAuthRouter;
