import { exec } from "child_process";
import path from "path";
import fs from "fs";

export const mergeImages = async (req, res) => {
  try {
    const { images, grid_size } = req.body;
    if (!images || images.length === 0) return res.status(400).json({ error: "Chưa có ảnh!" });

    const scriptPath = path.resolve("scripts/merge_images.py");
    const outputImagePath = `merged_output.png`;

    const command = `python ${scriptPath} "${JSON.stringify(images)}" ${grid_size} ${outputImagePath}`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) return res.status(500).json({ error: stderr });

      // Trả về ảnh ghép
      res.json({ merged_image: `http://localhost:4000/${outputImagePath}` });
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi hệ thống!" });
  }
};
