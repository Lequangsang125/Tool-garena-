import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import userModel from "../../models/userModel.js";

let refreshTokens = []
// Tạo Access Token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, admin: user.admin }, process.env.JWT_SECRET, { expiresIn: "20s" });
};

// Tạo Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, admin: user.admin }, process.env.JWT_SECRET_REFRESH, { expiresIn: "365d" });
};

// Đăng ký
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Đăng nhập
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({
      $or: [{ username }, { email: username }]
    });
    if (!user || !user.password) return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    // Xóa tất cả refreshTokens cũ trước khi lưu mới

    res.cookie("refreshToken", refreshToken, {
      httpOnly: false,
      secure: false,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const userData = user.toObject();
    // 🛠 Chỉ destructuring đúng 1 lần để ẩn password
    const { password: _, ...others } = userData;
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);

    return res.status(200).json({ message: "Đăng nhập thành công", ...others, accessToken });

  } catch (error) {
    console.error("Lỗi server:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

//hàm tạo lại token
export const refreshTokenHandler = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập hoặc phiên đã hết hạn" });
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: "Token không hợp lệ hoặc đã bị thu hồi" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
    const { id, username } = decoded; // Trích xuất user từ refreshToken

    // Xóa token cũ khỏi mảng
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    // Tạo token mới
    const newAccessToken = generateAccessToken({ id, username });
    const newRefreshToken = generateRefreshToken({ id, username });

    refreshTokens.push(newRefreshToken); // Lưu token mới vào mảng

    // Set cookie mới
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: false,
      secure: false,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    return res.json({message:"accesstoken sau khi làm mới ", accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: "Refresh token không hợp lệ" });
  }
};


// Đăng xuất
export const logout = async (req, res) => {
  try {
    // Kiểm tra xem refreshToken có tồn tại trong cookies không
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).json({ message: "Không tìm thấy refreshToken" });
    }

    // Xóa cookie refreshToken
    res.clearCookie("refreshToken", {
      httpOnly: true,    // Cookie chỉ có thể được truy cập bởi server
      secure: process.env.NODE_ENV === 'production', // Sử dụng secure trong môi trường production
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Sử dụng 'None' trong production, 'Lax' trong development
      path: '/'          // Đảm bảo path là đúng
    });

    // Lọc bỏ refreshToken khỏi danh sách các token hợp lệ
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);

    // Phản hồi thành công
    return res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.error("Lỗi server:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// Gửi email quên mật khẩu
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset mật khẩu",
      text: `Bạn đã yêu cầu đặt lại mật khẩu. Nhấp vào link sau để reset: 
      ${process.env.CLIENT_URL}/reset-password/${resetToken}`,
    });

    res.json({ message: "Email đặt lại mật khẩu đã được gửi" });
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
