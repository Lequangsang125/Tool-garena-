import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import userModel from "../../models/userModel.js";


// Tạo Access Token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, admin: user.admin }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Tạo Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, admin: user.admin }, process.env.JWT_SECRET_REFRESH, { expiresIn: "365d" });
};

// Đăng ký
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await userModel.findOne({ $or: [{email},{username}] });
    if (existingUser) return res.status(400).json({ message: "Email hoặc tên tài khoản đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.error("Lỗi server:", error);
    console.error("Lỗi server:", error.message, error.stack);

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
    
    await userModel.findByIdAndUpdate(user._id,{refreshToken})
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
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập hoặc phiên đã hết hạn" });
    }

    // Tìm user có refreshToken này
    const user = await userModel.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: "Token không hợp lệ hoặc đã bị thu hồi" });
    }

    // Giải mã token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);

    // Tạo token mới
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Lưu refreshToken mới vào database
    await userModel.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });

    // Cập nhật cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    return res.json({ message: "Access token đã được làm mới", accessToken: newAccessToken });
  } catch (error) {
    console.error("Lỗi refresh token:", error);
    return res.status(403).json({ message: "Refresh token không hợp lệ" });
  }
};



// Đăng xuất
export const logout = async (req, res) => {
  try {
    // Kiểm tra xem refreshToken có tồn tại trong cookies không
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      // Nếu không có refreshToken trong cookie, thông báo người dùng không cần đăng xuất
      return res.status(400).json({ message: "Không có refreshToken để đăng xuất!" });
    }

    // Kiểm tra tính hợp lệ của refreshToken
    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.error("Lỗi xác thực refreshToken:", err);
        // Nếu refreshToken không hợp lệ hoặc đã hết hạn, vẫn có thể xóa token
      }

      // Xóa refreshToken trong cookie và cơ sở dữ liệu (nếu refreshToken hợp lệ hoặc bị hết hạn)
      await userModel.findOneAndUpdate(
        { _id: decoded ? decoded.id : null },  // Nếu có decoded.id thì tìm theo ID, nếu không thì bỏ qua
        { refreshToken: null } // Cập nhật trường refreshToken thành null
      );

      // Xóa cookie refreshToken
      res.clearCookie("refreshToken", {
        httpOnly: true,    // Cookie chỉ có thể được truy cập bởi server
        secure: process.env.NODE_ENV === 'production', // Sử dụng secure trong môi trường production
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Sử dụng 'None' trong production, 'Lax' trong development
        path: '/'          // Đảm bảo path là đúng
      });

      // Phản hồi thành công
      return res.status(200).json({ message: "Đăng xuất thành công" });
    });
  } catch (error) {
    console.error("Lỗi server:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
}
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
