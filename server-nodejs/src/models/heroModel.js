import axios from "axios";

export async function getPrelogin(username) {
  let url = `https://sso.garena.com/api/prelogin?app_id=10100&account=${username}&format=json&id=${Date.now()}`;
  let response = await axios.get(url);
  return response.data;
}

export async function getLogin(username, encryptedPassword) {
  let url = `https://sso.garena.com/api/login?app_id=10100&account=${username}&password=${encryptedPassword}&redirect_uri=https%3A%2F%2Faccount.garena.com%2F%3Flocale_name%3DVN&format=json&id=${Date.now()}`;
  let response = await axios.get(url);

  // Lấy `sso_key` từ response headers
  const rawCookies = response.headers["set-cookie"] || [];
  const cookies = rawCookies.join("; ");
  const ssoKeyMatch = cookies.match(/sso_key=([^;]+)/);
  const ssoKey = ssoKeyMatch ? ssoKeyMatch[1] : null;

  return { data: response.data, ssoKey };
}

export async function getAccountInfo(ssoKey) {
  let config = {
    method: "GET",
    url: "https://account.garena.com/api/account/init",
    headers: { "Cookie": `sso_key=${ssoKey}` },
  };
  let response = await axios.request(config);
  return response.data;
}
