from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
import random
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def login_garena(username, password):
    # Cấu hình ChromeOptions
    chrome_options = Options()
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-setuid-sandbox')
    chrome_options.add_argument('--disable-infobars')
    chrome_options.add_argument('--disable-extensions')
    chrome_options.add_argument('--disable-gpu')

    # Quan trọng: Không thêm --headless để mở trình duyệt với giao diện người dùng
    # chrome_options.add_argument('--headless')  # Xóa dòng này nếu có

    # Đường dẫn đúng đến chromedriver.exe
    driver_path = 'C:/Users/binhm/Desktop/chrome/chrome-win64/chromedriver.exe'  # Đảm bảo đây là đường dẫn đúng

    # Khởi tạo trình duyệt
    driver = webdriver.Chrome(service=Service(driver_path), options=chrome_options)
    
    try:
        # Mở trang đăng nhập Garena
        driver.get("https://auth.garena.com/universal/oauth?response_type=token&client_id=100054&redirect_uri=https%3A%2F%2Fsale.lienquan.garena.vn%2Flogin%2Fcallback&locale=vi-VN&platform=1")
        
        # Đợi cho đến khi ô nhập tài khoản xuất hiện
        WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder='Tài khoản Garena, Email hoặc số điện thoại']")))
        
        # Nhập tài khoản với độ trễ ngẫu nhiên
        username_input = driver.find_element(By.CSS_SELECTOR, "input[placeholder='Tài khoản Garena, Email hoặc số điện thoại']")
        for char in username:
            username_input.send_keys(char)
            time.sleep(random.uniform(0.3, 1.5))  # Độ trễ ngẫu nhiên giữa các ký tự
        
        # Nhập mật khẩu với độ trễ ngẫu nhiên
        password_input = driver.find_element(By.CSS_SELECTOR, "input[placeholder='Mật khẩu']")
        for char in password:
            password_input.send_keys(char)
            time.sleep(random.uniform(0.3, 1.5))  # Độ trễ ngẫu nhiên giữa các ký tự
        
        # Chờ nút đăng nhập xuất hiện và click
        login_button = WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button.primary")))
        login_button.click()

        # Kiểm tra CAPTCHA nếu có
        try:
            captcha = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'div.g-recaptcha')))
            print("⚠️ CAPTCHA xuất hiện, vui lòng giải quyết CAPTCHA thủ công!")
            time.sleep(30)  # Đợi người dùng giải quyết CAPTCHA
            print("✅ CAPTCHA đã được giải quyết. Tiếp tục đăng nhập!")
        except:
            print("🔒 Không có CAPTCHA, tiếp tục đăng nhập.")
        
        # Đợi thêm để đảm bảo trang đã tải xong
        time.sleep(5)
        
        # Chụp ảnh màn hình
        screenshot_path = "garena_login.png"
        driver.save_screenshot(screenshot_path)
        print(f"✅ Ảnh chụp màn hình đã được lưu tại {screenshot_path}")

    finally:
        # Đóng trình duyệt
        driver.quit()

# Chạy thử
login_garena("edagawa2023", "Manhbg06052004@")
