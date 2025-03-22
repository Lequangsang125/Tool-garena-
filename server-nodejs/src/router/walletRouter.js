import express from "express";
import { depositMoney, getBalance, getTransactions, payWithBalance } from "../controllers/thanhToanCongXu/walletController.js";

const walletRouter = express.Router();

walletRouter.post("/nap-tien", depositMoney);
walletRouter.get("/so-du", getBalance);
walletRouter.post("/pay", payWithBalance);
walletRouter.get("/lich-su-giao-dich", getTransactions);

export default walletRouter;
