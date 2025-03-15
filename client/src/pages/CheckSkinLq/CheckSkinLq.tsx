import { useState } from "react";
import { Toaster, toast } from "sonner"; // ✅ Import Sonner

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

export default function CheckSkinLq() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [skins, setSkins] = useState([]); // ✅ State để lưu danh sách trang phục
  const [showPassword, setShowPassword] = useState(false); // ✅ Ẩn/hiện mật khẩu

  const handleLogin = async () => {
    toast.info("🔍 Đang kiểm tra tài khoản...", { duration: 1500 });

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("✅ Đăng nhập thành công!", { duration: 2000 });
        setSkins(data.skins || []); // ✅ Lưu danh sách trang phục vào state
      } else {
        toast.error(`❌ Đăng nhập thất bại: ${data.message}`, { duration: 2500 });
        setSkins([]); // Xóa danh sách cũ nếu đăng nhập thất bại
      }
    } catch (error) {
      toast.error("❌ Lỗi hệ thống, vui lòng thử lại!", { duration: 2500 });
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="dark:text-white">
        <PageMeta title="Check Trang Phục Liên Quân" description="Hướng dẫn sử dụng công cụ check trang phục Liên Quân" />
        <PageBreadcrumb pageTitle="Check trang phục Liên Quân" />
        
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
            <Button size="sm" variant="primary" onClick={handleLogin}>Đăng nhập</Button>
          </ComponentCard>

          {/* ✅ Hiển thị danh sách trang phục sau khi đăng nhập */}
          {skins.length > 0 && (
            <ComponentCard title="Danh Sách Trang Phục">
              <ul className="list-disc list-inside">
                {skins.map((skin, index) => (
                  <li key={index} className="text-green-500">{skin}</li>
                ))}
              </ul>
            </ComponentCard>
          )}
        </div>
      </div>
    </>
  );
}
