import axios from "axios";
import userModel from "../../models/userModel.js";
import mongoose from "mongoose";
import transactionModal from "../../models/transactionModal.js";
import Deposit from "../../models/transactionModal.js";
import Payment from "../../models/paymentModel.js";


// Hàm nạp tiền
export async function depositMoney(req, res) {
    try {
        const { userId, amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Số tiền nạp không hợp lệ" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User không tồn tại!" });
        }

        // Đảm bảo balance tồn tại
        user.balance = user.balance || 0;
        user.balance += amount;
        await user.save();

        // Ghi lại lịch sử giao dịch
        const deposit = new Deposit({
            userId,
            amount,
            description: "Nạp tiền vào tài khoản",
        });
        await deposit.save();

        res.status(200).json({
            message: "Nạp tiền thành công",
            newBalance: user.balance,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json("Lỗi server!",error);
    }
}

// Hàm kiểm tra số dư
export async function getBalance(req, res) {
    try {
        const { userId } = req.query;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "userId không hợp lệ" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User không tồn tại" });
        }

        res.status(200).json({ balance: user.balance || 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
}

// Hàm thanh toán
export async function payWithBalance(req, res) {
    try {
        const { userId, amount, description } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "UserId không hợp lệ" });
        }
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Số tiền thanh toán không hợp lệ" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User không tồn tại!" });
        }

        if (user.balance < amount) {
            return res.status(400).json({ message: "Số dư không đủ" });
        }

        // Trừ tiền
        user.balance -= amount;
        await user.save();

        // Ghi lại lịch sử giao dịch
        const payment = new Payment({
            userId,
            amount: -amount,
            description: description || "Thanh toán sản phẩm",
        });
        await payment.save();

        res.status(200).json({
            message: "Thanh toán thành công",
            newBalance: user.balance,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Lỗi server!" });
    }
}

// Hàm xem lịch sử giao dịch
export async function getTransactions(req, res) {
        try {
            const { userId } = req.query;
    
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: "userId không hợp lệ!" });
            }
    
            // Lấy lịch sử thanh toán
            const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
    
            // Lấy lịch sử nạp tiền
            const deposits = await Deposit.find({ userId }).sort({ createdAt: -1 });
    
            res.status(200).json({ payments, deposits });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server!" });
        }
    }
    