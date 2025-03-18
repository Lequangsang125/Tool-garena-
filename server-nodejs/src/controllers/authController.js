
import axios from 'axios';
import CryptoJS from 'crypto-js';

let info = {
  username: "",
  password: "",
};
// hàm tiền đăng nhập 
export async function getPrelogin(username) {
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
  console.log("url prelogin", config.url);
  const response = await axios.request(config);
  return response.data;
  
}
// hàm đăng nhập 
export async function getLogin(username, password) {
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
  console.log("url login", config.url);
  const { data, headers } = await axios.request(config);
  const rawCookies = headers["set-cookie"] || [];
  const cookies = rawCookies.join("; ");
  const ssoKeyMatch = cookies.match(/sso_key=([^;]+)/);
  const ssoKey = ssoKeyMatch ? ssoKeyMatch[1] : null;
  if (!ssoKey) throw new Error("Không tìm thấy `sso_key`");
  return { data, ssoKey };
}
// hàm lấy thông tin tài khoản garena kèm cookie 
export async function getAccountInfo(ssoKey) {
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
//hàm lấy cookie để get skin
export async function loginSaleGarena(ssoKey) {
  try {
    if (!ssoKey) {
      throw new Error("Thiếu `ssoKey` để đăng nhập vào Sale Garena.");
    }

    // Cấu hình axios để nhận cookies
    axios.defaults.withCredentials = true;

    const config = {
      maxBodyLength: Infinity,
      method: "GET",
      url: `https://auth.garena.com/api/universal/oauth?response_type=token&client_id=100054&redirect_uri=https%3A%2F%2Fsale.lienquan.garena.vn%2Flogin%2Fcallback&locale=vi-VN&platform=1&format=json&id=${Date.now()}`,
      headers: {
        Accept: "application/json, text/plain, */*",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
        Connection: "keep-alive",
        Cookie: `sso_key=${ssoKey}`,
      },
    };

    const response = await axios.request(config);
    console.log("Kết quả đăng nhập Sale Garena:", response.data);

    const redirectUri = response.data?.redirect_uri;
    if (!redirectUri) {
      throw new Error("Không tìm thấy redirect_uri trong response.");
    }

    // Lấy access token từ redirect_uri
    const accessTokenMatch = redirectUri.match(/access_token=([^&]+)/);
    const accessToken = accessTokenMatch ? accessTokenMatch[1] : null;
    if (!accessToken) {
      throw new Error("Không lấy được access_token.");
    }

    console.log("Access Token:", accessToken);

    // Gửi request đến redirectUri và lấy cookies
    const sessionSigResponse = await axios.get(redirectUri, {
      withCredentials: true,
      maxRedirects: 0, // Không tự động follow redirect
      validateStatus: (status) => status >= 200 && status < 400, // Chấp nhận cả mã 3xx
      headers: {
        Accept: "application/json, text/plain, */*",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
        Connection: "keep-alive",
      },
    });

    console.log("Response Headers:", sessionSigResponse.headers);

    // Kiểm tra cookies trong cả 'set-cookie' và 'cookie'
    const setCookies = sessionSigResponse.headers['set-cookie'] || sessionSigResponse.headers['cookie'];

    if (!setCookies) {
      throw new Error("Không tìm thấy cookies trong response.");
    }

    console.log("Cookie Headers:", setCookies);

    const sessionSig = setCookies
      .find(cookie => cookie.includes("session.sig"))
      ?.split("session.sig=")[1]?.split(";")[0];

    if (!sessionSig) {
      throw new Error("Không lấy được session.sig từ cookies.");
    }

    console.log("Session Sig:", sessionSig);
    return { accessToken, sessionSig };
  } catch (error) {
    console.error("Lỗi khi đăng nhập Sale Garena:", error.message);
    return null;
  }
}

// Hàm login 
export async function login(req, res) {
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
}

// hàm login và lấy id skin 
export async function loginAndGetSkin(req, res){
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
    const accSale = await loginSaleGarena(ssoKey);
    console.log("đăng nhập sale", accSale);
    

    res.status(200).json({ success: true, data: accountInfo });
  } catch (error) {
    console.error("Lỗi trong quá trình chạy:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}


