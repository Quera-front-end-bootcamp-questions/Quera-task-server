import { Request, Response } from "express";
import { getUserById } from "../../Repository/UserRepo/UserRepository";
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
