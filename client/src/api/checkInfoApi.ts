import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL;

const loginGarena = async ({ username, password, recaptchaToken }) => {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("🚫 Bạn chưa đăng nhập! Vui lòng đăng nhập trước.");
  }

  const response = await fetch(`${API_URL}/api/lienquan/login-garena`, {
    method: 'POST',
    credentials: "include", 
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },

    body: JSON.stringify({ username, password, recaptchaToken }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Lỗi hệ thống!");
  }

  return data;
};

// Hook sử dụng react-query để gọi API login
export const useLoginGarena = () => {
  return useMutation(loginGarena);
};
