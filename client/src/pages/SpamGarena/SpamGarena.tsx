import { useState } from "react";
import { Toaster, toast } from "sonner";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

export default function SpamGarena() {
  const [username, setUsername] = useState("");

  const handleLogin = async () => {
    if (!username) {
      toast.error("❌ Vui lòng nhập tài khoản!");
      return;
    }
  
    console.log("📌 Username trước khi gửi request:", username); // Kiểm tra giá trị username
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/lienquan/spam-garena`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }), // 🟢 Gửi username vào BE
      });
  
      const data = await response.json();
      console.log("📌 Kết quả từ BE:", data);
    } catch (error) {
      console.error("🚨 Lỗi khi fetch API:", error);
    }
  };
  

  return (
    <>
      <Toaster position="top-center" richColors />
      <PageMeta title="Spam acc Garena" description="Tiến hành spam tài khoản Garena" />
      <PageBreadcrumb pageTitle="Spam acc Garena" />

      <div className="space-y-3 dark:text-white">
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

            <Button size="sm" variant="primary" onClick={handleLogin}>
              Tiến hành spam
            </Button>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
