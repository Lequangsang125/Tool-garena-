import userModel from "../../models/userModel.js";

const MOMO_PARTNER_CODE = "MOMOXXXX"; // Thay bằng mã đối tác
const MOMO_ACCESS_KEY = "ACCESS_KEY"; // Thay bằng access key
const MOMO_SECRET_KEY = "SECRET_KEY"; // Thay bằng secret key
const MOMO_ENDPOINT = "https://test-payment.momo.vn/v2/gateway/api/create"; // Dùng test hoặc production
//tạo dữ liệu gửi momo
export async function createMomoPayment(req, res) {
    try {
        const { userId, amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Số tiền không hợp lệ!" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại!" });
        }

        // Tạo dữ liệu gửi Momo
        const orderId = `ORDER_${Date.now()}`;
        const requestId = `REQ_${Date.now()}`;
        const orderInfo = `Nạp ${amount} vào tài khoản`;

        const rawData = `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=&ipnUrl=https://your-server.com/api/momo/webhook&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=https://your-client.com/success&requestId=${requestId}&requestType=captureWallet`;

        const signature = crypto.createHmac("sha256", MOMO_SECRET_KEY)
            .update(rawData)
            .digest("hex");

        const requestBody = {
            partnerCode: MOMO_PARTNER_CODE,
            accessKey: MOMO_ACCESS_KEY,
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: "https://your-client.com/success",
            ipnUrl: "https://your-server.com/api/momo/webhook",
            requestType: "captureWallet",
            extraData: "",
            signature: signature
        };

        // Gửi request đến Momo
        const response = await axios.post(MOMO_ENDPOINT, requestBody);

        if (response.data && response.data.payUrl) {
            res.status(200).json({ payUrl: response.data.payUrl });
        } else {
            res.status(400).json({ message: "Không thể tạo thanh toán Momo!" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server!" });
    }
}


// Momo sẽ gửi dữ liệu về Webhook khi thanh toán thành công.
export async function momoWebhook(req, res) {
    try {
        const { orderId, amount, resultCode, message } = req.body;

        if (resultCode === 0) {
            // Giao dịch thành công
            const deposit = await Deposit.findOne({ orderId });

            if (!deposit) {
                return res.status(400).json({ message: "Giao dịch không hợp lệ!" });
            }

            const user = await User.findById(deposit.userId);
            if (!user) {
                return res.status(400).json({ message: "Không tìm thấy user!" });
            }

            // Cộng tiền vào tài khoản
            user.balance += amount;
            await user.save();

            deposit.status = "success";
            await deposit.save();

            return res.status(200).json({ message: "Nạp tiền thành công!" });
        }

        return res.status(400).json({ message: `Thanh toán thất bại: ${message}` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server!" });
    }
}
