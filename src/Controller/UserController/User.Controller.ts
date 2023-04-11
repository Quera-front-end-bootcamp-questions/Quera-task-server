import { Request, Response } from "express";
import { sendResponse } from "../../Utils/SendResponse";

import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from "../../Repository/UserRepo/UserRepository";

import { encrypt } from "../../Utils/Crypto/Crypto";

interface UserRequestBody {
  username: string;
  firstname?: string;
  lastname?: string;
  email: string;
  password: string;
  profile_url?: string;
  phone?: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

export const registerUserController = async (
  req: Request<any, any, UserRequestBody>,
  res: Response
) => {
  const { username, email, password, firstname, lastname, phone, profile_url } =
    req.body;

  const existingEmail = await getUserByEmail(email);
  if (existingEmail) {
    return sendResponse(res, 409, null, "Email address is already in use");
  }
  console.log(existingEmail);
  // Check if the username is already in use
  const existingUsername = await getUserByUsername(username);
  if (existingUsername) {
    return sendResponse(res, 409, null, "Username is already in use");
  }
  console.log(existingUsername);

  const encryptedPassword = encrypt(password);

  const user = await createUser({ ...req.body, password_hash: encryptedPassword });

  return sendResponse(res, 201, user, "User registered successfully");
};
