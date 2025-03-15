import CryptoJS from "crypto-js";

export function encryptPassword(password, preloginData) {
  return CryptoJS.SHA1(preloginData.pwd_salt + password).toString();
}
