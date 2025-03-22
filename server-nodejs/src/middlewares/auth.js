import jwt from "jsonwebtoken";

// Middleware xác thực Access Token
export const verifyToken = (req, res, next) => {
  // Lấy token từ headers (chuẩn hơn)
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Bạn cần đăng nhập để có quyền!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token hết hạn, vui lòng đăng nhập lại!" });
    }
    return res.status(403).json({ message: "Token không hợp lệ!" });
  }
};

export const verifyTokenAndAdminAuth = (req, res, next) => {
  verifyToken(req, res, () => { 
    console.log("User từ token:", req.user); // Debug giá trị user

    if (req.user.id === req.params.id || req.user.admin) {
      console.log("✅ Người dùng có quyền!");
      next();
    } else {
      console.log("❌ Người dùng không có quyền!", req.user);
      return res.status(403).json({ message: "Bạn không có quyền thực hiện hành động này!" });
    }
  });
};
