
import express from 'express';
import cors from 'cors'; 
import bodyParser from 'body-parser';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const app = express();
const port = process.env.PORT || 4000;


// ✅ Cấu hình CORS
app.use(cors({
  origin: 'https://tool-garena-v1-lqs.onrender.com', // Cho phép truy cập từ frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức được phép
  credentials: true, // Cho phép gửi cookie và headers
}));

app.use(bodyParser.json());

// ... (phần code còn lại của bạn)
let info = {
  username: "",
  password: "",
};

async function getPrelogin(username) {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://sso.garena.com/api/prelogin?app_id=10100&account=${username}&format=json&id=${new Date().getTime()}`,
    headers: {
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "vi,en-US;q=0.9,en;q=0.8",
      Connection: "keep-alive",
      Cookie:
        "_ga=GA1.1.26128831.1691742988; _ga_Y1QNJ6ZLV6=GS1.1.1692620638.1.0.1692620645.0.0.0; _ga_1M7M9L6VPX=GS1.1.1693919088.3.1.1693919245.0.0.0; datadome=6c34MIurz0vTp7mEEAbR88446VmZxLzTjLCZvcwX1ypNT1AagpHyJ-Nq_SCz76e3uIBLnjDCPSG3cFOr1c0hq8SkJWA1SykfI~QgbgyzkhDyiqZxugImyQnVA9U8cpdv",
      Referer:
        "https://sso.garena.com/universal/lo...count.garena.com/?locale_name=VN&locale=vi-VN",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
      "sec-ch-ua":
        '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "x-datadome-clientid":
        "6c34MIurz0vTp7mEEAbR88446VmZxLzTjLCZvcwX1ypNT1AagpHyJ-Nq_SCz76e3uIBLnjDCPSG3cFOr1c0hq8SkJWA1SykfI~QgbgyzkhDyiqZxugImyQnVA9U8cpdv",
    },
  };
  const response = await axios.request(config);
  return response.data;
}

async function getLogin(username, password) {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://sso.garena.com/api/login?app_id=10100&account=${username}&password=${password}&redirect_uri=https%3A%2F%2Faccount.garena.com%2F%3Flocale_name%3DVN&format=json&id=${new Date().getTime()}`,
    headers: {
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "vi,en-US;q=0.9,en;q=0.8",
      Connection: "keep-alive",
      Cookie:
        "_ga=GA1.1.26128831.1691742988; _ga_Y1QNJ6ZLV6=GS1.1.1692620638.1.0.1692620645.0.0.0; _ga_1M7M9L6VPX=GS1.1.1693919088.3.1.1693919558.0.0.0; datadome=2GqV~ROOiaRRpc6bP~fBEAvfPKzjr35a0kMBN0jo3EIsTatuD6G4_9j-ydq9Gvc3IvlRJVKORI_zK6auOrO8klDdNMD7-kdJZT0moINr~JD_RDwVVmxQvrj-KTmKYmSY",
      Referer:
        "https://sso.garena.com/universal/lo...count.garena.com/?locale_name=VN&locale=vi-VN",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
      "sec-ch-ua":
        '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "x-datadome-clientid":
        "2GqV~ROOiaRRpc6bP~fBEAvfPKzjr35a0kMBN0jo3EIsTatuD6G4_9j-ydq9Gvc3IvlRJVKORI_zK6auOrO8klDdNMD7-kdJZT0moINr~JD_RDwVVmxQvrj-KTmKYmSY",
    },
  };
  const { data, headers } = await axios.request(config);
  const rawCookies = headers["set-cookie"] || [];
  const cookies = rawCookies.join("; ");
  const ssoKeyMatch = cookies.match(/sso_key=([^;]+)/);
  const ssoKey = ssoKeyMatch ? ssoKeyMatch[1] : null;
  if (!ssoKey) throw new Error("Không tìm thấy `sso_key`");
  return { data, ssoKey };
}

async function getAccountInfo(ssoKey) {
  let config = {
    method: "GET",
    url: "https://account.garena.com/api/account/init",
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "*/*",
      "Cookie": `sso_key=${ssoKey}`,
    },
  };
  const response = await axios.request(config);
  return response.data;
}

app.post('/run', async (req, res) => {
  try {
    const { username, password } = req.body;
    info.username = username;
    info.password = password;

    const preloginData = await getPrelogin(info.username);
    const hashedPassword = CryptoJS.MD5(info.password);
    const encryptedPassword = CryptoJS.SHA256(
      CryptoJS.SHA256(hashedPassword + preloginData.v1) + preloginData.v2
    );
    const finalPassword = CryptoJS.AES.encrypt(hashedPassword, encryptedPassword, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.NoPadding,
    }).toString(CryptoJS.format.Hex);

    const { data, ssoKey } = await getLogin(info.username, finalPassword);
    console.log("API check đúng sai:", data);
    console.log("SSO Key sau khi đăng nhập:", ssoKey);
    const accountInfo = await getAccountInfo(ssoKey);
    console.log("Thông tin tài khoản:", accountInfo);

    res.status(200).json({ success: true, data: accountInfo });
  } catch (error) {
    console.error("Lỗi trong quá trình chạy:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});