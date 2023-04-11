import CryptoJS from "crypto-js";

const TokenKey: string = process.env.TOKEN_KEY!;

// Encrypt
const encrypt = (input: string): string => {
  const ciphertext = CryptoJS.AES.encrypt(input, TokenKey).toString();
  return ciphertext;
};

// Decrypt
const decrypt = (input: string): string => {
  const bytes = CryptoJS.AES.decrypt(input, TokenKey);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);

  return originalText;
};

const compareHash = (noneHash: string, hash: string):boolean => {
  const decrypted = decrypt(hash);
  const isMatch: boolean = noneHash === decrypted;
  return isMatch
};
export { decrypt, encrypt, compareHash };
