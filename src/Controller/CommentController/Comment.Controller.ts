import { Request, Response } from "express";
import {
  createComment,
  deleteComment,
  getCommentById,
  getCommentsByTaskId,
  updateComment,
} from "../../Repository/CommentRepo/CommentRepository";
import { sendResponse } from "../../Utils/SendResponse";

export const createCommentController = async (
  req: Request<any, any, { text: string; userId: string; taskId: string }, any>,
  res: Response
) => {
  const { text, userId, taskId } = req.body;

  try {
    const comment = await createComment(text, userId, taskId);

    return sendResponse(res, 201, comment, "Comment created successfully");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, "Server error");
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
      return sendResponse(res, 404, null, "Comment not found");
    }

    return sendResponse(res, 200, comment, "Comment retrieved successfully");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, "Server error");
  }
};

export const getCommentsByTaskIdController = async (
  req: Request<any, any, any, { taskId: string }>,
  res: Response
) => {
  const taskId: any = req.params.taskId;

  try {
    const comments = await getCommentsByTaskId(taskId);

    return sendResponse(res, 200, comments, "Comments retrieved successfully");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, "Server error");
  }
};

export const updateCommentController = async (
  req: Request<any, any, any, { id: string; text: string }>,
  res: Response
) => {
  const { id, text } = req.body;

  try {
    const updatedComment = await updateComment(id, text);

    if (!updatedComment) {
      return sendResponse(res, 404, null, "Comment not found");
    }

    return sendResponse(res, 200, updatedComment, "Comment updated successfully");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, "Server error");
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
      return sendResponse(res, 404, null, "Comment not found");
    }

    return sendResponse(res, 200, null, "Comment deleted successfully");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, "Server error");
  }
};