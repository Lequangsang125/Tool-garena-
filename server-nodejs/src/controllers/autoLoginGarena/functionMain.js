import axios from 'axios';
import CryptoJS from 'crypto-js';
import { getAccountInfo, getLogin, getPrelogin } from './loginController.js';
import { getSkinList, loginSaleGarena } from './loginAndGetSessionController.js';


//==================hàm con góp phần chạy luồng==============
// B0 - tạo datadom
// B1-GET: hàm tiền đăng nhập 
// B2-GET: hàm đăng nhập vào web chính 
// B3-GET: hàm lấy thông tin tài khoản garena kèm cookie-ssoKey
//B4-GET: hàm lấy ssokey để đăng nhập trang dịch vụ và lấy ra sessionSig
//B5-POST: đăng nhập thành công POST sessionsig lấy skindata

//================hàm phụ thuộc các hàm trên ================
// Hàm login chỉ để check thôgn tin acc 
// Hàm login và lấy danh sách skin

// Hàm login chỉ để check thôgn tin acc 

let info = {
    username: "",
    password: "",
  };
  
export async function loginGarena(req, res) {
    try {
      const { username, password } = req.body;
      info.username = username;
      info.password = password;
      // const dataDom = await getNewDataDom();     
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
  