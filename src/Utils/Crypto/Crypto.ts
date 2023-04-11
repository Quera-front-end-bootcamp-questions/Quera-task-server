import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// Encrypt password
const encrypt = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
};

// Compare password
const compareHash = async (noneHash: string, hash: string): Promise<boolean> => {
  const isMatch: boolean = await bcrypt.compare(noneHash, hash);
  return isMatch;
};

export { encrypt, compareHash };
