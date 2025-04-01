import sys
import json
import requests
from PIL import Image
import numpy as np

# Nhận dữ liệu từ Node.js
image_urls = json.loads(sys.argv[1])  # Danh sách URL ảnh
grid_size = int(sys.argv[2])  # Kích thước lưới (3x3)
output_path = sys.argv[3]  # Đường dẫn ảnh xuất

# Tải ảnh từ URL
images = []
for url in image_urls:
    response = requests.get(url, stream=True)
    img = Image.open(response.raw).convert("RGBA")
    images.append(img)

# Xác định kích thước ảnh nhỏ nhất để cắt cho đồng đều
min_width = min(img.width for img in images)
min_height = min(img.height for img in images)

# Resize tất cả ảnh về cùng kích thước
images = [img.resize((min_width, min_height), Image.LANCZOS) for img in images]

# Tạo ảnh nền lớn
merged_width = min_width * grid_size
merged_height = min_height * grid_size
merged_image = Image.new("RGBA", (merged_width, merged_height), (255, 255, 255, 0))

# Ghép ảnh vào lưới
for index, img in enumerate(images[:grid_size * grid_size]):
    x = (index % grid_size) * min_width
    y = (index // grid_size) * min_height
    merged_image.paste(img, (x, y))

# Lưu ảnh
merged_image.save(output_path)
print(output_path)  # Trả về đường dẫn ảnh
