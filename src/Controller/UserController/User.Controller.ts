import { Request, Response } from 'express';
import updateUser, {
  getUserById,
} from '../../Repository/UserRepo/UserRepository';
import { sendResponse } from '../../Utils/SendResponse';
import { getUserByUsername } from '../../Repository/AuthRepo/AuthRepository';
import { log } from 'console';
import { Types } from 'mongoose';

export const getUserByIdController = async (
  req: Request<any, any, any, { id: string }>,
  res: Response
) => {
  const userId: any = req.params.id;

  try {
    const user = await getUserById(userId);

    if (!user) {
      return sendResponse(res, 404, null, 'User not found');
    }

    // remove password hash from response
    user.password_hash = undefined;

    return sendResponse(res, 200, user, 'User retrieved successfully');
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, 'Server error');
  }
};

export const getUserByUsernameController = async (
  req: Request<any, any, any, { username: string }>,
  res: Response
) => {
  const usernameOrId: any = req.params.usernameOrId;

  try {
    console.log('here');

    const user: any = Types.ObjectId.isValid(usernameOrId)
      ? await getUserById(usernameOrId)
      : await getUserByUsername(usernameOrId);
    console.log(user);

    if (!user) {
      return sendResponse(res, 404, null, 'User not found');
    }
    console.log(user);

    // remove password hash from response
    const { __v, password_hash, settings, ...toBeSendedUser } = user._doc;

    return sendResponse(
      res,
      200,
      toBeSendedUser,
      'User retrieved successfully'
    );
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, 'Server error');
  }
};

export const updateUserController = async (req: any, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const { id: userTokenId } = req.user;

  try {
    if (id !== userTokenId) {
      console.log(`id: ${id}, tokenId: ${userTokenId}`);

      sendResponse(
        res,
        403,
        null,
        "you don't have access to change data of another user"
      );
    }

    const updatedUser = await updateUser(id, updateData);

    if (!updatedUser) {
      return sendResponse(res, 404, null, 'User not found');
    }

    // remove password hash from response
    updatedUser.password_hash = undefined;
    updatedUser.__v = undefined;

    return sendResponse(res, 200, updatedUser, 'User updated successfully');
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, 'Server error');
  }
};
