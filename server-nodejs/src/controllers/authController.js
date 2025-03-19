
import axios from 'axios';
import CryptoJS from 'crypto-js';

let info = {
  username: "",
  password: "",
};
// B1-GET: hàm tiền đăng nhập 
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
  // console.log("url prelogin", config.url);
  const response = await axios.request(config);
  return response.data;
  
}
// B2-GET: hàm đăng nhập vào web chính 
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
  // console.log("url login", config.url);
  const { data, headers } = await axios.request(config);
  const rawCookies = headers["set-cookie"] || [];
  const cookies = rawCookies.join("; ");
  const ssoKeyMatch = cookies.match(/sso_key=([^;]+)/);
  const ssoKey = ssoKeyMatch ? ssoKeyMatch[1] : null;
  if (!ssoKey) throw new Error("Không tìm thấy `sso_key`");
  return { data, ssoKey };
}
// B3-GET: hàm lấy thông tin tài khoản garena kèm cookie-ssoKey
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
//B4-GET: hàm lấy ssokey để đăng nhập trang dịch vụ và lấy ra sessionSig
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
    // console.log("Kết quả đăng nhập Sale Garena:", response.data);

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

    // console.log("Access Token:", accessToken);

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

    // Kiểm tra cookies trong cả 'set-cookie' và 'cookie'
    const setCookies = sessionSigResponse.headers['set-cookie'] || sessionSigResponse.headers['cookie'];

    if (!setCookies) {
      throw new Error("Không tìm thấy cookies trong response.");
    }

    // console.log("Cookie Headers:", setCookies);

    const session = setCookies
      .find(cookie => cookie.includes("session=") && !cookie.includes("session.sig"))
      ?.match(/session=([^;]+)/)?.[1];
    
    const sessionSig = setCookies
      .find(cookie => cookie.includes("session.sig"))
      ?.match(/session\.sig=([^;]+)/)?.[1];
    
    // console.log("Session:", session);
    // console.log("Session Sig:", sessionSig);
    
    if (!sessionSig) {
      throw new Error("Không lấy được session.sig từ cookies.");
    }
    return { session, sessionSig };
  } catch (error) {
    console.error("Lỗi khi đăng nhập Sale Garena:", error.message);
    return null;
  }
}
//B5-POST: đăng nhập thành công POST 
export async function getSkinList(session, sessionSig) {
  try {
    const config = {
      method: "POST",
      maxBodyLength: Infinity,
      url: "https://sale.lienquan.garena.vn/graphql",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
        Connection: "keep-alive",
        Cookie: `session=${session};session.sig=${sessionSig}`,
      },
      data: {
        query: "{ getUser { id name profile { ownedItemIdList } } }",
      },
    };

    const response = await axios.request(config);
    const skinList = response.data?.data?.getUser?.profile?.ownedItemIdList;
// console.log(response.data);

    if (!skinList) {
      throw new Error("Không lấy được danh sách skin.");
    }

    // console.log("Danh sách skin:", skinList);
    return skinList;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách skin:", error.message);
    return null;
  }
}
// Hàm login chỉ để check thôgn tin acc 
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
    // console.log("API check đúng sai:", data);
    // console.log("SSO Key sau khi đăng nhập:", ssoKey);
    const accountInfo = await getAccountInfo(ssoKey);
    // console.log("Thông tin tài khoản:", accountInfo);
    const limitedInfo = {
      user_info: {
        uid: accountInfo.user_info.uid,
        username: accountInfo.user_info.username,
        nickname: accountInfo.user_info.nickname,
        mobile_no: accountInfo.user_info.mobile_no,
        email: accountInfo.user_info.email,
        idcard: accountInfo.user_info.idcard,
        is_two_factor: accountInfo.user_info.is_two_factor,
        is_email_verified: accountInfo.user_info.is_email_verified,
      },
    };

    res.status(200).json({ 
      success: 'true',
      data: limitedInfo });
  } catch (error) {
    console.error("Lỗi trong quá trình chạy:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
// Hàm login và lấy danh sách skin
export async function loginAndGetSkin(req, res) {
  try {
    const { username, password } = req.body;
    info.username = username;
    info.password = password;

    // Bước 1: Lấy prelogin data
    const preloginData = await getPrelogin(info.username);

    // Bước 2: Mã hóa mật khẩu
    const hashedPassword = CryptoJS.MD5(info.password);
    const encryptedPassword = CryptoJS.SHA256(
      CryptoJS.SHA256(hashedPassword + preloginData.v1) + preloginData.v2
    );
    const finalPassword = CryptoJS.AES.encrypt(hashedPassword, encryptedPassword, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.NoPadding,
    }).toString(CryptoJS.format.Hex);

    // Bước 3: Đăng nhập và lấy ssoKey
    const { data, ssoKey } = await getLogin(info.username, finalPassword);
    // console.log("API check đúng sai:", data);
    // console.log("SSO Key sau khi đăng nhập:", ssoKey);

    // Bước 4: Lấy thông tin tài khoản
    const accountInfo = await getAccountInfo(ssoKey);
    // console.log("Thông tin tài khoản:", accountInfo);

    // Bước 5: Đăng nhập Sale Garena
    const accSale = await loginSaleGarena(ssoKey);
    // console.log("Đăng nhập Sale Garena:", accSale);

    // Bước 6: Lấy danh sách skin bằng accessToken và sessionSig
    const ToolGiaRe = await getSkinList(accSale.session, accSale.sessionSig);

    res.status(200).json({
      success: true,
      ToolGiaRe,
    });
  } catch (error) {
    console.error("Lỗi trong quá trình chạy:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
