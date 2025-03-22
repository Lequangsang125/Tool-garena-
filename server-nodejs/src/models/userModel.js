import mongoose from "mongoose";
import validator from "validator"; // Cần cài `npm install validator`

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username không được để trống"],
      minlength: [6, "Username phải có ít nhất 6 ký tự"],
      maxlength: [50, "Username tối đa 50 ký tự"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email là bắt buộc"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Email không hợp lệ"], // Kiểm tra email hợp lệ
    },
    password: {
      type: String,
      required: [true, "Mật khẩu không được để trống"],
    },
    admin: {
      type: Boolean,  // Chắc chắn rằng enum này có giá trị hợp lệ
      default: 'false'
  },
    balance: {
      type: Number,
      default: 0,
      min: [0, "Số dư không thể nhỏ hơn 0"]
    },
    resetToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
