import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

interface Skin {
  id_skin: string;
  name: string;
  label: string;
  label_level: string;
  image: string;
  hero_name: string;
}

export default function TableDataSkinLq() {
  const [skinsData, setSkinsData] = useState<Skin[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/heroes_skins.json");
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
        const sortedSkins = flatSkins.sort((a, b) => parseInt(a.id_skin) - parseInt(b.id_skin));

        console.log("Dữ liệu làm phẳng và sắp xếp:", sortedSkins);
        setSkinsData(sortedSkins);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">STT</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">ID</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Tướng</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Hình ảnh</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Tên skin</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Ảnh bậc skin</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Bậc skin</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {skinsData.map((skin, index) => (
                <TableRow key={skin.id_skin}>
                  {/* STT */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start dark:text-gray-400">{index + 1}</TableCell>

                  {/* ID skin */}
                  <TableCell className="px-5 py-4 sm:px-6">
                    <span className="block font-medium text-gray-800 dark:text-white/90">{skin.id_skin}</span>
                  </TableCell>

                  {/* Tên tướng */}
                  <TableCell className="px-5 py-4 sm:px-6 text-center">
                    <span className="block font-medium text-gray-800 dark:text-white/90">{skin.hero_name}</span>
                  </TableCell>

                  {/* Ảnh skin */}
                  <TableCell className="px-3 py-2 text-gray-500 text-center dark:text-gray-400">
                    <img src={skin.image} alt={skin.name} className="w-30 h-30 object-cover" />
                  </TableCell>

                  {/* Tên Skin */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start dark:text-gray-400">{skin.name}</TableCell>

                  {/* Ảnh Bậc skin */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start dark:text-gray-400">
                    {skin.label === "N/A" ? (
                      <span className="font-medium">Trang phục mặc định</span>
                    ) : (
                      <img src={skin.label} alt={skin.name} className="h-10 object-cover" />
                    )}
                  </TableCell>

                  {/* Bậc Skin */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start dark:text-gray-400">{skin.label_level}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}