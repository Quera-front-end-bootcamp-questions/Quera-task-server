import { Request, Response } from "express";
import updateUser, { getUserById } from "../../Repository/UserRepo/UserRepository";
import { sendResponse } from "../../Utils/SendResponse";

export const getUserByIdController = async (
  req: Request<any, any, any, { id: string }>,
  res: Response
) => {
  const userId: any = req.params.id;

  try {
    const user = await getUserById(userId);

    if (!user) {
      return sendResponse(res, 404, null, "User not found");
    }

    // remove password hash from response
    user.password_hash = undefined;

    return sendResponse(res, 200, user, "User retrieved successfully");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, "Server error");
  }
};

export const updateUserController = async (
    req: Request<any, any, any, { id: string, firstname: string, lastname: string, email: string }>,
    res: Response
  ) => {
    const { id } = req.params;
    const updateData = req.body;
  
    try {
      const updatedUser = await updateUser(id, updateData);
  
      if (!updatedUser) {
        return sendResponse(res, 404, null, "User not found");
      }
  
      // remove password hash from response
      updatedUser.password_hash = undefined;
  
      return sendResponse(res, 200, updatedUser, "User updated successfully");
    } catch (error) {
      console.error(error);
      return sendResponse(res, 500, null, "Server error");
    }
  };