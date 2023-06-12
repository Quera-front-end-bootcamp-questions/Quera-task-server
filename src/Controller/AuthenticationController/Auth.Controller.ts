import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { sendResponse } from '../../Utils/SendResponse';
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
  updatePasswordResetToken,
  updatePassword,
  getUserByPasswordResetToken,
} from '../../Repository/AuthRepo/AuthRepository';
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from '../../Utils/Jsonwebtoken';
import { compareHash } from '../../Utils/Crypto/Crypto';
import EmailSender from '../../Utils/EmailServices/EmailSender';

const registerUserController = async (
  req: Request<any, any, any>,
  res: Response
) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);

    // Check if the email is already in use
    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return sendResponse(res, 409, null, 'Email address is already in use');
    }

    // Check if the username is already in use
    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      return sendResponse(res, 409, null, 'Username is already in use');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = await createUser({
      ...req.body,
      password_hash: hashedPassword,
    });
    const { __v, password_hash, ...toBeSend } = user.toObject();

    return sendResponse(res, 201, toBeSend, 'User registered successfully');
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, 'Internal Server Error');
  }
};

const loginUserController = async (req: Request, res: Response) => {
  try {
    const { emailOrUsername, password } = req.body;

    // Find user by email or username
    const user =
      (await getUserByEmail(emailOrUsername)) ||
      (await getUserByUsername(emailOrUsername));

    if (!user) {
      return sendResponse(res, 400, null, 'Invalid email/username or password');
    }

    const {
      __v,
      password_hash,
      workspaces,
      workspaceMember,
      taskAssignees,
      comments,
      projectMember,
      ...toBeSendUserData
    } = user.toObject();

    // Compare entered password with hashed password
    const isPasswordValid = await compareHash(password, user.password_hash);
    console.log(isPasswordValid);

    if (!isPasswordValid) {
      return sendResponse(res, 400, null, 'Invalid email/username or password');
    }

    // Create access and refresh tokens
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // Send response with tokens
    return sendResponse(
      res,
      200,
      { accessToken, refreshToken, toBeSendUserData },
      'User logged in successfully'
    );
  } catch (error) {
    console.error('login error:', error);
    return sendResponse(res, 500, null, 'Server error');
  }
};

const forgotPasswordController = async (
  req: Request<any, any, { email: string }>,
  res: Response
) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await getUserByEmail(email);

    if (!user) {
      return sendResponse(res, 404, null, 'User not found');
    }

    // Generate password reset token
    const token = randomBytes(20).toString('hex');

    // Update user with password reset token
    await updatePasswordResetToken(user.id, token);

    // Send password reset email to user
    const subject = 'Reset your password';
    const message = `Hi ${user.username},\n\nYou have requested to reset your password. Please click on the following link to reset your password:\n\nhttps://example.com/reset-password?token=${token}\n\nIf you did not request a password reset, please ignore this email.\n\nBest regards,\nThe Example Team`;
    const mailData = { subject, html: message };
    EmailSender(email, mailData, (data: any) => {
      if (data.error) {
        console.error(data.error);
        return sendResponse(res, 500, null, 'Internal Server Error');
      }
      return sendResponse(
        res,
        200,
        null,
        'Password reset token sent successfully'
      );
    });
  } catch (error) {
    console.error('login error:', error);
    return sendResponse(res, 500, null, 'Server error');
  }
};

const resetPasswordController = async (
  req: Request<any, any, { token: string; password: string }>,
  res: Response
) => {
  try {
    const { token, password } = req.body;

    // Find user by password reset token
    const user = await getUserByPasswordResetToken(token);

    if (!user) {
      return sendResponse(res, 404, null, 'Invalid password reset token');
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user with new password
    await updatePassword(user.id, hashedPassword);

    // Send response
    return sendResponse(res, 200, null, 'Password reset successfully');
  } catch (error) {
    console.error('login error:', error);
    return sendResponse(res, 500, null, 'Server error');
  }
};

//create refresh token api for user
const createRefreshTokenController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded: any = verifyRefreshToken(refreshToken);

    // Create new access token
    const accessToken = createAccessToken(decoded);

    // Send response
    return sendResponse(
      res,
      200,
      { accessToken },
      'Refresh token created successfully'
    );
  } catch (error) {
    console.error('login error:', error);
    return sendResponse(res, 500, null, 'Server error');
  }
};
export {
  registerUserController,
  loginUserController,
  createRefreshTokenController,
  forgotPasswordController,
  resetPasswordController,
};
