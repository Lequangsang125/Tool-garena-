import { useEffect, useState } from "react";
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

export default function GhepAnhLienQuan() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [skinsData, setSkinsData] = useState<Skin[]>([]);
  const [filteredSkins, setFilteredSkins] = useState<Skin[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/heroes_skins.json",{mode: "no-cors"});
        if (!response.ok) throw new Error("Không tìm thấy file JSON");

        const data = await response.json();

        // Làm phẳng dữ liệu và thêm hero_name vào từng skin
        const flatSkins: Skin[] = data.flatMap((hero: any) =>
          hero.skins.map((skin: any) => ({
            ...skin,
            hero_name: hero.hero_name,
          }))
        );

        // Sắp xếp theo id_skin tăng dần
        const sortedSkins = flatSkins.sort((a, b) =>
          a.label_level.localeCompare(b.label_level)
        );

        console.log("Dữ liệu làm phẳng và sắp xếp:", sortedSkins);
        setSkinsData(sortedSkins);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogin = async () => {
    toast.info("🔍 Đang kiểm tra tài khoản...");

    try {
      const response = await fetch(
        "http://localhost:4000/api/lienquan/login-getskin",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("✅ Tài khoản đúng!");
        setResult("✅ Tài khoản đúng!");
        setAccountInfo(data.data);

        const ownedSkins = data?.skinList ?? [];

        // Kiểm tra kiểu dữ liệu và thử ép kiểu đúng khi lọc
        const filteredSkins = skinsData.filter((skin) =>
          ownedSkins.includes(Number(skin.id_skin))
        );

        setFilteredSkins(filteredSkins);
      } else {
        toast.error("❌ Tài khoản sai!");
        setResult("❌ Tài khoản sai!");
        setAccountInfo(null);
        setFilteredSkins([]);
      }
    } catch (error) {
      console.error("Lỗi khi fetch API:", error);
      toast.error("❌ Lỗi hệ thống, vui lòng thử lại!");
      setResult("❌ Lỗi hệ thống, vui lòng thử lại!");
      setAccountInfo(null);
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
        - Web đã mã hóa mật khẩu trước khi kiểm tra<br/>
        - Tài khoản và mật khẩu của bạn luôn được bảo mật<br/>
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

            <Button size="sm" variant="primary" onClick={handleLogin}>
              Kiểm tra
            </Button>
          </div>
        </ComponentCard>

        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[1102px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="pl-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400"
                    >
                      STT
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400"
                    >
                      Hình ảnh
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400"
                    >
                      Tên skin
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400"
                    >
                      Tên tướng
                    </TableCell>
                    <TableCell
                      isHeader
                      className="hidden lg:block px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400"
                    >
                      Bậc skin
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {filteredSkins.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan="7"
                        className="px-5 py-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        {result === "❌ Tài khoản sai!"
                          ? "Tài khoản hoặc mật khẩu không chính xác."
                          : "Tài khoản không sở hữu trang phục nào!"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSkins.map((skin, index) => (
                      <TableRow key={skin.id_skin}>
                        <TableCell className="px-4 w-10 lg:w-30 py-3 text-gray-500 text-start dark:text-gray-400">
                          {index + 1}
                        </TableCell>
                        <TableCell className="px-3 w-50 lg:w-60 py-2 text-gray-500 text-center dark:text-gray-400">
                          <img
                            src={skin.image}
                            alt={skin.name}
                            className="w-30 h-30 object-cover"
                          />
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start dark:text-gray-400">
                          {skin.name}
                        </TableCell>
                        <TableCell className="px-4 mt-10 py-3 text-gray-500 text-start dark:text-gray-400 hidden lg:block">
                          {skin.hero_name}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start dark:text-gray-400">
                          {skin.label === "N/A" ? (
                            <span className="font-medium">
                              Trang phục mặc định
                            </span>
                          ) : (
                            <img
                              src={skin.label}
                              alt={skin.name}
                              className="h-10 object-cover"
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
