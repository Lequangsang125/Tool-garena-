import axios from 'axios';

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
//B5-POST: đăng nhập thành công POST lấy data skin
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