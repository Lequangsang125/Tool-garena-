import { useState } from "react";
import { Toaster, toast } from "sonner"; // ✅ Import Sonner

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

export default function CheckDungSai() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null); // ✅ Lưu kết quả đúng/sai
  const [showPassword, setShowPassword] = useState(false); // ✅ Ẩn/hiện mật khẩu
  const [accountInfo, setAccountInfo] = useState(null); // ✅ Lưu thông tin tài khoản

  const handleLogin = async () => {
    toast.info("🔍 Đang kiểm tra tài khoản...", { duration: 1500 });

    try {
      const response = await fetch("https://tool-garena-backend.onrender.com/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("✅ Tài khoản đúng!", { duration: 2000 });
        setResult("✅ Tài khoản đúng!");
        setAccountInfo(data.data); // ✅ Lưu thông tin tài khoản
      } else {
        toast.error("❌ Tài khoản sai!", { duration: 2500 });
        setResult("❌ Tài khoản sai!");
        setAccountInfo(null); // ✅ Xóa thông tin tài khoản nếu có lỗi
      }
    } catch (error) {
      toast.error("❌ Lỗi hệ thống, vui lòng thử lại!", { duration: 2500 });
      setResult("❌ Lỗi hệ thống, vui lòng thử lại!");
      setAccountInfo(null); // ✅ Xóa thông tin tài khoản nếu có lỗi
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="dark:text-white">
        <PageMeta title="Check thông tin acc garena" description="Kiểm tra tài khoản Garena đúng hay sai" />
        <PageBreadcrumb pageTitle="Check thông tin acc garena" />
        
        <div className="space-y-6 p-4">
          <ComponentCard title="Nhập Tài Khoản">
            <div className="space-y-6">
              <Label htmlFor="username">Tài khoản:</Label>
              <Input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="space-y-6">
              <Label htmlFor="password">Mật khẩu:</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button
                  size="xs"
                  variant="outline"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </Button>
              </div>
            </div>
            <Button size="sm" variant="primary" onClick={handleLogin}>Kiểm tra</Button>
          </ComponentCard>

          {/* ✅ Hiển thị kết quả kiểm tra */}
          {result && (
            <ComponentCard title="Kết Quả">
              <p className={result.includes("✅") ? "text-green-500" : "text-red-500"}>{result}</p>
            </ComponentCard>
          )}

          {/* ✅ Hiển thị thông tin tài khoản */}
          {accountInfo && (
            <ComponentCard title="Thông Tin Tài Khoản">
               <pre className="text-sm dark:text-white">
              Số điện thoại: {!!accountInfo.user_info.mobile_no ? 'Yes' :'No'} - {accountInfo.user_info.mobile_no}
              </pre>
              <pre className="text-sm dark:text-white">
              Email: {!!accountInfo.user_info.email ? 'Yes' :'No'} - {accountInfo.user_info.email}
              </pre>
              <pre className="text-sm dark:text-white">
              CMND: {!!accountInfo.user_info.idcard ? 'Đã gắn' :'No'} - {accountInfo.user_info.idcard}
              </pre>

            </ComponentCard>
          )}
        </div>
      </div>
    </>
  );
}