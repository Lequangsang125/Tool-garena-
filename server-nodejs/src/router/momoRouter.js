import express from "express";
import { createMomoPayment, momoWebhook } from "../controllers/thanhToanCongXu/momoController.js";


const momoRoutes = express.Router();

momoRoutes.post("/create", createMomoPayment);
momoRoutes.post("/webhook", momoWebhook);

export default momoRoutes;
