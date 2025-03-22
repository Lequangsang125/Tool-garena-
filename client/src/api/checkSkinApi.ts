const API_URL = import.meta.env.VITE_API_URL;

async function fetchWithAuth(url: string, options: any = {}) {
  let response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  console.log("📡 Response Status:", response.status);

  if (response.status === 401) {
    try {
      console.log("🔄 Token hết hạn, đang làm mới...");

      const refreshResponse = await fetch(`${API_URL}/api/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      });

      console.log("📡 Refresh Token Status:", refreshResponse.status);

      if (!refreshResponse.ok) {
        throw new Error("❌ Làm mới token thất bại, yêu cầu đăng nhập lại.");
      }

      // 🆕 Gọi lại API gốc sau khi token mới được cấp
      response = await fetch(url, {
        ...options,
        credentials: "include",
      });

    } catch (error) {
      console.error("🚫 Không thể làm mới token, yêu cầu đăng nhập lại!");
      return null;
    }
  }

  try {
    const data = await response.json();
    console.log("✅ API Response:", data);
    return data;
  } catch (error) {
    console.error("⚠️ API không trả về JSON hợp lệ!", error);
    return null;
  }
}


export async function loginGetSkin(username: string, password: string, recaptchaToken: string | null) {
  if (!username || !password) {
    throw new Error("⚠️ Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
  }
  if (!recaptchaToken) {
    throw new Error("⚠️ Bạn chưa xác minh reCAPTCHA!");
  }

  return fetchWithAuth(`${API_URL}/api/lienquan/login-getskin`, {
    method: "POST",
     credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, recaptchaToken }),
  });
}
