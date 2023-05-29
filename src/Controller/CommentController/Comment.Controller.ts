import { Request, Response } from 'express';
import {
  deleteComment,
  getCommentById,
  getCommentsByTaskId,
  updateComment,
} from '../../Repository/CommentRepo/CommentRepository';
import { sendResponse } from '../../Utils/SendResponse';
import { Comment } from '../../Models/Comment/Comment';
import { Types } from 'mongoose';
import { User } from '../../Models/User/User';
import { Task } from '../../Models/Task/Task';

export const createCommentController = async (req: any, res: Response) => {
  const { text, taskId } = req.body;
  const userId = req.user.id;

  try {
    // Create new comment
    const newComment = new Comment({
      text: text,
      user: new Types.ObjectId(userId),
      task: new Types.ObjectId(taskId),
    });
    await newComment.save();
    const toBeSendData = newComment.toObject();
    delete toBeSendData.__v;

    // Push comment ID to corresponding User and Task
    await User.findByIdAndUpdate(userId, {
      $push: { comments: newComment._id },
    });
    await Task.findByIdAndUpdate(taskId, {
      $push: { comments: newComment._id },
    });

    return sendResponse(
      res,
      201,
      toBeSendData,
      'Comment created successfully.'
    );
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, 'Server error');
  }
};

export const getCommentByIdController = async (
  req: Request<any, any, any, { id: string }>,
  res: Response
) => {
  const commentId: any = req.params.id;

  try {
    const comment = await getCommentById(commentId);

    if (!comment) {
      return sendResponse(res, 404, null, 'Comment not found');
    }

    return sendResponse(res, 200, comment, 'Comment retrieved successfully');
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, 'Server error');
  }
};

export const getCommentsByTaskIdController = async (
  req: Request<any, any, any, { taskId: string }>,
  res: Response
) => {
  const taskId: any = req.params.taskId;

  try {
    const comments = await getCommentsByTaskId(taskId);

    return sendResponse(res, 200, comments, 'Comments retrieved successfully');
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, 'Server error');
  }
};

export const updateCommentController = async (
  req: Request<any, any, any, { id: string; text: string }>,
  res: Response
) => {
  const { text } = req.body;
 const commentId = req.params.id

  try {
    const updatedComment = await updateComment(commentId, text);

    if (!updatedComment) {
      return sendResponse(res, 404, null, 'Comment not found');
    }

    return sendResponse(
      res,
      200,
      updatedComment,
      'Comment updated successfully'
    );
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, 'Server error');
  }
};

export const deleteCommentController = async (
  req: Request<any, any, any, { id: string }>,
  res: Response
) => {
  const commentId: string = req.params.id;

  try {
    const deleted = await deleteComment(commentId);

    if (!deleted) {
      return sendResponse(res, 404, null, 'Comment not found');
    }

    return sendResponse(res, 200, null, 'Comment deleted successfully');
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, 'Server error');
  }
};
