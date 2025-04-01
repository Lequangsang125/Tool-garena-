import { useState } from "react";
import { useDispatch } from "react-redux"; // ✅ Thêm dispatch
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../redux/apiRequest";
 // ✅ Import hàm đăng ký

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch(); // ✅ Khai báo dispatch
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isChecked) {
      setError("Bạn cần đồng ý với điều khoản trước khi đăng ký.");
      return;
    }

    const response = await registerUser(formData, dispatch, navigate); // ✅ Nhận kết quả từ API
  console.log("🟢 Kết quả đăng ký:", response);

  if (!response.success) { // ✅ Kiểm tra lỗi và hiển thị
    setError(response.error);
    console.error("🔴 Lỗi đăng ký:", response.error);
  }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center lg:mt-30 w-full max-w-md mx-auto">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          Đăng ký
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <Label htmlFor="username">Tên đăng nhập<span className="text-error-500">*</span></Label>
            <Input
              type="text"
              id="username"
              name="username"
              placeholder="Vui lòng nhập tên đăng nhập"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <Label htmlFor="email">Email<span className="text-error-500">*</span></Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Vui lòng nhập email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Label htmlFor="password">Mật khẩu<span className="text-error-500">*</span></Label>
            <div className="relative">
              <Input
                placeholder="Vui lòng nhập mật khẩu"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                )}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                className="w-5 h-5"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
              />
              <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                Tôi đồng ý với{" "}
                <span className="text-gray-800 dark:text-white/90">Điều Khoản</span> sử dụng của trang web
              </p>
            </div>

            {error && (
              <div className="mt-2 text-red-500 text-sm">{error}</div>
            )}

            <button
              type="submit"
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
            >
              Đăng ký
            </button>
          </div>
        </form>

        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Bạn đã có tài khoản ?{" "}
            <Link to="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
