import { useState, useRef } from "react";
import { Toaster, toast } from "sonner";
import Cookies from 'js-cookie';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import ReCaptcha from "../../components/common/ReCaptcha";

export default function CheckInfoGarena() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  const handleLogin = async () => {
    if (!recaptchaToken) {
      toast.error("⚠ Vui lòng xác nhận reCAPTCHA!");
      return;
    }
  
    toast.info("🔍 Đang kiểm tra tài khoản...");
  
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("🚫 Bạn chưa đăng nhập! Vui lòng đăng nhập trước.");
        setResult("🚫 Bạn chưa đăng nhập! Vui lòng đăng nhập trước.");
        setAccountInfo(null);
        return; // Dừng quá trình xử lý khi thiếu token
      }
  
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/lienquan/login-garena`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ username, password, recaptchaToken }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        toast.success("✅ Tài khoản đúng!");
        setResult("✅ Tài khoản đúng!");
        setAccountInfo(data.data);
      } else {
        toast.error("❌ Tài khoản sai!");
        setResult("❌ Tài khoản sai!");
        setAccountInfo(null);
      }
    } catch (error) {
      // Kiểm tra lỗi từ hệ thống
      if (error.message === "Unauthorized" || error.message.includes("token")) {
        toast.error("❌ Lỗi thiếu token, vui lòng đăng nhập lại!");
        setResult("❌ Lỗi thiếu token, vui lòng đăng nhập lại!");
      } else {
        toast.error("❌ Lỗi hệ thống, vui lòng thử lại!");
        setResult("❌ Lỗi hệ thống, vui lòng thử lại!");
      }
      setAccountInfo(null);
    }
  
    // TỰ ĐỘNG RESET reCAPTCHA SAU KHI XỬ LÝ XONG
    recaptchaRef.current?.resetCaptcha();
  };
  
  return (
    <>
      <Toaster position="top-center" richColors />
      <PageMeta
        title="Check thông tin acc Garena"
        description="Kiểm tra tài khoản Garena đúng hay sai"
      />
      <PageBreadcrumb pageTitle="Check thông tin acc Garena" />

      <div className="space-y-3">
        <ComponentCard title="Nhập Tài Khoản">
          <div className="space-y-4">
            <Label htmlFor="username">Tài khoản:</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tài khoản Garena"
            />

            <Label htmlFor="password">Mật khẩu:</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
              />
              <Button
                size="xs"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </Button>
            </div>

            {/* reCAPTCHA */}
            <ReCaptcha ref={recaptchaRef} onVerify={setRecaptchaToken} />

            <Button
              size="sm" variant="primary" onClick={handleLogin}>
              Kiểm tra
            </Button>
          </div>
        </ComponentCard>

        {result && (
          <ComponentCard title="Kết Quả Kiểm Tra">
            <p
              className={`text-lg font-bold ${result.includes("✅") ? "text-green-500" : "text-red-500"
                }`}
            >
              {result}
            </p>
            {accountInfo && (
              <div className="mt-4">
                <ul className="space-y-2 border rounded-lg p-4 bg-gray-50">
                  <h3 className="text-lg font-semibold mb-2">
                    Thông tin tài khoản:
                  </h3>
                  <li>
                    <strong>UID:</strong> {accountInfo.user_info.uid}
                  </li>
                  <li>
                    <strong>Username:</strong> {accountInfo.user_info.username}
                  </li>
                  <li>
                    <strong>Nickname:</strong> {accountInfo.user_info.nickname}
                  </li>
                  <li>
                    <strong>Số điện thoại:</strong> {accountInfo.user_info.mobile_no}
                    {accountInfo.user_info.mobile_no ? "✅" : "Không có ❌"}
                  </li>
                  <li>
                    <strong>Email:</strong> {accountInfo.user_info.email}
                    {accountInfo.user_info.email ? "✅" : "Không có ❌"}
                  </li>
                  <li>
                    <strong>CMND:</strong>{accountInfo.user_info.idcard}
                    {accountInfo.user_info.idcard ? "✅" : "Không có ❌"}
                  </li>
                  <li>
                    <strong>Xác thực hai bước:</strong>{" "}
                    {accountInfo.user_info.is_two_factor
                      ? "Có ✅"
                      : "Không có ❌"}
                  </li>
                  <li>
                    <strong>Email xác minh:</strong>{" "}
                    {accountInfo.user_info.is_email_verified
                      ? "Có ✅"
                      : "Không có ❌"}
                  </li>
                </ul>
              </div>
            )}
          </ComponentCard>
        )}
      </div>
    </>
  );
}
