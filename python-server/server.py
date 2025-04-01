import requests
from io import BytesIO
from PIL import Image, ImageDraw

# Danh sách URL ảnh (thay bằng ảnh của bạn)
image_urls = [
    "https://lienquan.garena.vn/wp-content/uploads/2024/05/91376ad2e960ef7f70bc230dd4ccaaf46597c3b3508f41-e1718876704430.jpg",
    "https://lienquan.garena.vn/wp-content/uploads/2024/05/6edf6b905bee94b87752824faa15f4226597c37372ac11-e1718876713223.jpg",
    "https://lienquan.garena.vn/wp-content/uploads/2024/05/060d854d8e1132659bc37a254396a61f611790eb0e35a1.png",
    "https://lienquan.garena.vn/wp-content/uploads/2024/05/13ae4ea5c64e2845277bc875721207e95fa8bb8c3dbad1-e1718876726348.png",
    "https://lienquan.garena.vn/wp-content/uploads/2024/05/b09b18011a25828e323874458798a1325e16e2167ca201.jpg",
    "https://lienquan.garena.vn/wp-content/uploads/2024/05/ab0b68ebd2e8df3116d91231ec0e55fc5e16e1f05c8701-1.jpg",
    "https://lienquan.garena.vn/wp-content/uploads/2024/05/e08fcfd16f1efc71019125d8a975f12a658d368d212661-e1718875847415.jpg",
    "https://lienquan.garena.vn/wp-content/uploads/2024/05/df6333d7fabc4db3d6c6b0f5bd84504a658d31ae6f8751.jpg",
    "https://lienquan.garena.vn/wp-content/uploads/2024/05/ec0a81792c19067b2fa4c1be12df1f85658d31672d2391-e1718875866325.jpg"
]


# Hàm tải ảnh từ URL
def download_image(url):
    response = requests.get(url)
    return Image.open(BytesIO(response.content))


# Tải ảnh
images = [download_image(url) for url in image_urls]

# Resize ảnh về kích thước nhỏ nhất
min_width = min(img.width for img in images)
min_height = min(img.height for img in images)
images = [img.resize((min_width, min_height), Image.LANCZOS) for img in images]

# Thông số ghép ảnh
padding = 10  # Khoảng cách giữa các hàng
border_size = 2  # Độ dày viền vàng
num_cols = 3  # 3 cột
num_rows = 3  # 3 hàng


total_width = num_cols * min_width + (num_cols - 1) *  num_cols 
total_height = (num_rows * min_height) + (num_rows - 1) * padding + num_rows * 2 * border_size

# Tạo ảnh nền
canvas = Image.new("RGB", (total_width, total_height), "#5064B5")

# Vẽ ảnh lên lưới
y_offset = 0
for row in range(num_rows):
    draw = ImageDraw.Draw(canvas)
    draw.rectangle(
        [(0, y_offset), (total_width, y_offset + min_height + 2 * border_size)],
        outline="yellow", width=border_size
    )

    x_offset = 0
    for col in range(num_cols):
        img = images[row * num_cols + col]
        # Dán ảnh vào đúng vị trí tính cả viền
        canvas.paste(img, (x_offset + border_size, y_offset + border_size))
        x_offset += min_width  # Thêm padding sau mỗi ảnh

    y_offset += min_height + padding + 2 * border_size  # Cập nhật y_offset

# Lưu ảnh kết quả
canvas.save("output.jpg")
canvas.show()
