import express from "express";
import { login, loginAndGetSkin } from "../controllers/functionMain.js";
import { spamAccGarena } from "../controllers/spamAccController.js";



const authRouter = express.Router();

// Định nghĩa route POST /auth/login
authRouter.post("/login",login);
authRouter.post("/login-getskin",loginAndGetSkin);
authRouter.post("/spam-garena",spamAccGarena);


export default authRouter;
