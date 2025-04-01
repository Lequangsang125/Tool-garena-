import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import Skeleton from "../../components/ui/Skeleton";
import ReCaptcha from "../../components/common/ReCaptcha";

export default function CheckSkinLq() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [skinsData, setSkinsData] = useState([]);
  const [filteredSkins, setFilteredSkins] = useState([]);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  
  const navigate = useNavigate()
  const recaptchaRef = useRef(null);
  const user = useSelector((state) => state.auth.login?.currentUser);
    useEffect(() => {
      if (!user) {
        navigate('/signin')
      }})

  // Fetch skin data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/heroes_skins.json");
        if (!response.ok) throw new Error("Không tìm thấy file JSON");

        const data = await response.json();
        // console.log("toàn bộ skin", data);
        
        // Làm phẳng dữ liệu và thêm hero_name vào từng skin
        const flatSkins = data.flatMap((hero) =>
          hero.skins.map((skin) => ({
            ...skin,
            hero_name: hero.hero_name,
          }))
        );

        // Sắp xếp theo id_skin tăng dần
        const sortedSkins = flatSkins.sort((a, b) =>
          a.label_level.localeCompare(b.label_level)
        );

        setSkinsData(sortedSkins);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        toast.error("❌ Lỗi hệ thống khi lấy dữ liệu skin!");
      }
    };

    fetchData();
  }, []);

  // Handle login and check skins
  const handleLogin = async () => {
    if (!recaptchaToken) {
      toast.error("⚠ Vui lòng xác nhận reCAPTCHA!");
      return;
    }
    toast.info("🔍 Đang kiểm tra tài khoản...");
    try {
      const response = await fetch(
        "http://localhost:4000/api/lienquan/login-getskin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password,recaptchaToken }),
        }
      );
      const data = await response.json();
      // console.log("skin trong acc", data);
      if (data.success) {
        toast.success("✅ Tài khoản đúng!");
        setResult("✅ Tài khoản đúng!");
        const ownedSkins = data?.ToolGiaRe ?? [];
        // console.log("Owned Skins:", ownedSkins); // In ra để kiểm tra
  
        // Kiểm tra dữ liệu và ép kiểu cho phù hợp
        const filteredSkins = skinsData.filter((skin) =>
          ownedSkins.includes(Number(skin.id_skin)) // Ép kiểu so sánh chính xác
        );
        const skinImages = filteredSkins.map(skin => skin.image);
        console.log('đây là toàn bộ skin cần ghép', skinImages);
        setFilteredSkins(filteredSkins);
      } else {
        toast.error("❌ Tài khoản sai!");
        setResult("❌ Tài khoản sai!");
        setFilteredSkins([]);
      }
    } catch (error) {
      console.error("Lỗi khi fetch API:", error);
      toast.error("❌ Lỗi hệ thống, vui lòng thử lại!");
      setResult("❌ Lỗi hệ thống, vui lòng thử lại!");
      setFilteredSkins([]);
    }
  };
  

  return (
    <>
      <Toaster position="top-center" richColors />
      <PageMeta
        title="Check thông tin acc Garena"
        description="Kiểm tra tài khoản Garena đúng hay sai"
      />
      <PageBreadcrumb pageTitle="Check thông tin acc Garena" />

      <div className="space-y-3 dark:text-white">
        <ComponentCard title="Lưu ý và sử dụng">
          - Web đã mã hóa mật khẩu trước khi kiểm tra
          <br />
          - Tài khoản và mật khẩu của bạn luôn được bảo mật
          <br />
          - Vui lòng đổi mật khẩu sau mỗi lần kiểm tra tránh ảnh hưởng đến uy tín website
        </ComponentCard>

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
            <ReCaptcha ref={recaptchaRef} onVerify={setRecaptchaToken} />
            <Button size="sm" variant="primary" onClick={handleLogin}>
              Kiểm tra
            </Button>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
