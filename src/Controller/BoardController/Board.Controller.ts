import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { sendResponse } from '../../Utils/SendResponse';
import { createBoard } from '../../Repository/BoardRepo/BoardRepository';

export interface ICreateBoardRequestBody {
  name: string;
  projectId: Types.ObjectId;
}

export interface IAuthenticatedRequest extends Request<any, any, any, any> {
  user: {
    id: string;
    username: string;
    email: string;
  };
  params: {
    id?: Types.ObjectId;
  };
}

export interface IAuthenticatedCreateRequest extends IAuthenticatedRequest {
  body: ICreateBoardRequestBody;
}

export const createBoardController = async (
  req: IAuthenticatedCreateRequest,
  res: Response
) => {
  const { name, projectId } = req.body;

  try {
    const userId: Types.ObjectId = new Types.ObjectId(req.user.id);
    
    const board = await createBoard(name, projectId, userId);
    return sendResponse(res, 201, board, 'Board created successfully');
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, 'Server error');
  }
};
