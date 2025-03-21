import express from "express";
import { login, loginAndGetSkin } from "../controllers/functionMain.js";
import { spamAccGarena } from "../controllers/spamAccController.js";



const garenaAuthRouter = express.Router();

// Định nghĩa route POST /auth/login
garenaAuthRouter.post("/login",login);
garenaAuthRouter.post("/login-getskin",loginAndGetSkin);
garenaAuthRouter.post("/spam-garena",spamAccGarena);


export default garenaAuthRouter;
