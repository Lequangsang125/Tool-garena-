import { useState, useImperativeHandle, forwardRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface ReCaptchaProps {
  onVerify: (token: string | null) => void;
}

const ReCaptcha = forwardRef(({ onVerify }: ReCaptchaProps, ref) => {
  const [key, setKey] = useState(0);

  const handleChange = (token: string | null) => {
    onVerify(token);
  };

  const resetCaptcha = () => {
    setKey((prev) => prev + 1);
    onVerify(null); // Xóa token cũ
  };

  // Cho phép parent component gọi resetCaptcha()
  useImperativeHandle(ref, () => ({
    resetCaptcha,
  }));

  return (
    <ReCAPTCHA
      key={key} // Reset bằng cách thay đổi key
      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      onChange={handleChange}
    />
  );
});

export default ReCaptcha;
