import express from "express";

const authRouter = express.Router();

// Định nghĩa route POST /auth/login
authRouter.post("/signin",login);
authRouter.post("/signup",login);
authRouter.post("/logout",login);




export default authRouter;
