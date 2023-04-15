import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { sendResponse } from "../../Utils/SendResponse";
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from "../../Repository/UserRepo/UserRepository";
import {
  createAccessToken,
  createRefreshToken,
} from "../../Utils/Jsonwebtoken";
import { compareHash } from "../../Utils/Crypto/Crypto";
interface UserRequestBody {
  username: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  password_hash: string;
  profile_url?: string;
  phone?: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}
const registerUserController = async (
  req: Request<any, any, any>,
  res: Response
) => {
  try {
    const { username, email, password } = req.body;

    // Check if the email is already in use
    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return sendResponse(res, 409, null, "Email address is already in use");
    }

    // Check if the username is already in use
    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      return sendResponse(res, 409, null, "Username is already in use");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = await createUser({
      ...req.body,
      password_hash: hashedPassword,
    });

    return sendResponse(res, 201, user, "User registered successfully");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, "Internal Server Error");
  }
};

const loginUserController = async (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body;

  // Find user by email or username
  const user =
    (await getUserByEmail(emailOrUsername)) ||
    (await getUserByUsername(emailOrUsername));

  if (!user) {
    return sendResponse(res, 401, null, "Invalid email/username or password");
  }

  // Compare entered password with hashed password
  const isPasswordValid = compareHash(password, user.password_hash);

  if (!isPasswordValid) {
    return sendResponse(res, 401, null, "Invalid email/username or password");
  }

  // Create access and refresh tokens
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  // Send response with tokens
  return sendResponse(
    res,
    200,
    { accessToken, refreshToken, user },
    "User logged in successfully"
  );
};
export { registerUserController, loginUserController };
