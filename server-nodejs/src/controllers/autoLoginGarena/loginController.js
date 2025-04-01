
import axios from 'axios';
import CryptoJS from 'crypto-js';
import puppeteer from "puppeteer";

let datadom = 'LMh3VBqTUF8ZxRoHv6OBj~Qy363YaklKTLDmDe6varjvYkxDLDiXRwaJm21bXsKsltONhnOYqB5ZW840uWjfpF2KcOVbp9_Ur6mQs_cUl~109ZxN4ZJxcLBW5AtB46sj';
let UserAgent = 'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.1.7) Gecko/20091221 Firefox/60.0';
//b0 - tạo datadom

// export async function getNewDataDom() {
//   const browser = await puppeteer.launch({ headless: false }); // Mở trình duyệt thật
//   const page = await browser.newPage();

//   // Mở trang Garena (hoặc URL liên quan đến đăng nhập)
//   await page.goto("https://account.garena.com/", { waitUntil: "networkidle2" });

//   // Lấy cookie chứa datadome
//   const cookies = await page.cookies();
//   const datadomeCookie = cookies.find((cookie) => cookie.name === "datadome");

//   console.log("New DataDome:", datadomeCookie ? datadomeCookie.value : "Not Found");

//   await browser.close();
//   return datadomeCookie ? datadomeCookie.value : null;
// }

// B1-GET: hàm tiền đăng nhập 
export async function getPrelogin(username,dataDom) {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://sso.garena.com/api/prelogin?app_id=10100&account=${username}&format=json&id=${new Date().getTime()}`,
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
        `${UserAgent}`,
      "sec-ch-ua":
        '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "x-datadome-clientid":
        `${datadom}`
    },
  };
  // console.log("url prelogin", config.url);
  const response = await axios.request(config);
  return response.data;
  
}

export async function getLogin(username, password,dataDom) {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://sso.garena.com/api/login?app_id=10100&account=${username}&password=${password}&redirect_uri=https%3A%2F%2Faccount.garena.com%2F%3Flocale_name%3DVN&format=json&id=${new Date().getTime()}`,
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
       `${UserAgent}`,
      "sec-ch-ua":
        '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "x-datadome-clientid":
         `${datadom}`
    },
  };
  // console.log("url login", config.url);
  const { data, headers } = await axios.request(config);
  const rawCookies = headers["set-cookie"] || [];
  const cookies = rawCookies.join("; ");
  const ssoKeyMatch = cookies.match(/sso_key=([^;]+)/);
  const ssoKey = ssoKeyMatch ? ssoKeyMatch[1] : null;
  if (!ssoKey) throw new Error("Tài khoản không chính xác`");
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
  console.log("đây là giá trị trả về",response.status);
  return response.data;
}

