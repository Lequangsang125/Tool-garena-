import axios from "axios";

const verifyRecaptcha = async (req, res, next) => {
  const recaptchaToken = req.body.recaptchaToken;

  if (!recaptchaToken) {
    return res.status(400).json({ success: false, message: "Thiếu reCAPTCHA token!" });
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: secretKey,
          response: recaptchaToken,
        },
      }
    );

    if (!response.data.success) {
      return res.status(400).json({ success: false, message: "reCAPTCHA không hợp lệ!" });
    }

    next(); // Nếu hợp lệ thì tiếp tục xử lý request
  } catch (error) {
    return res.status(500).json({ success: false, message: "Lỗi khi xác thực reCAPTCHA!" });
  }
};

export default verifyRecaptcha;
