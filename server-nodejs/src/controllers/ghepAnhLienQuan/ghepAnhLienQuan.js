import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const mergeImages = async (req, res) => {
  const { images } = req.body;

  if (!images || images.length === 0) {
    return res.status(400).json({ error: "Không có ảnh để ghép" });
  }

  const jsonFilePath = path.join(__dirname, "../images.json");
  fs.writeFileSync(jsonFilePath, JSON.stringify(images));

  exec(`python merge_images.py ${jsonFilePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Lỗi khi chạy Python: ${stderr}`);
      return res.status(500).json({ error: "Ghép ảnh thất bại" });
    }

    res.json({ merged_image: "http://localhost:4000/merged_image.jpg" });
  });
};
