import { Request, Response } from "express";
import {
  createTag,
  deleteTag,
  getTagById,
  getTagsByTaskId,
  updateTag,
} from "../../Repository/TagRepo/TagRepository";
import { sendResponse } from "../../Utils/SendResponse";

export const createTagController = async (
  req: Request<any, any, { name: string; taskId: string }, any>,
  res: Response
) => {
  const { name, taskId } = req.body;

  try {
    const tag = await createTag(name, taskId);

    return sendResponse(res, 201, tag, "Tag created successfully");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, "Server error");
  }
};

export const getTagByIdController = async (
  req: Request<any, any, any, { id: string }>,
  res: Response
) => {
  const tagId: any = req.params.id;

  try {
    const tag = await getTagById(tagId);

    if (!tag) {
      return sendResponse(res, 404, null, "Tag not found");
    }

    return sendResponse(res, 200, tag, "Tag retrieved successfully");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, "Server error");
  }
};

export const getTagsByTaskIdController = async (
  req: Request<any, any, any, { taskId: string }>,
  res: Response
) => {
  const taskId: any = req.params.taskId;

  try {
    const tags = await getTagsByTaskId(taskId);

    return sendResponse(res, 200, tags, "Tags retrieved successfully");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, "Server error");
  }
};
export const updateTagController = async (
  req: Request<any, any, any, { id: string; name: string }>,
  res: Response
) => {
  const { id, name } = req.body;

  try {
    const updatedTag = await updateTag(id, name);

    if (!updatedTag) {
      return sendResponse(res, 404, null, "Tag not found");
    }

    return sendResponse(res, 200, updatedTag, "Tag updated successfully");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, "Server error");
  }
};
export const deleteTagController = async (
  req: Request<any, any, any, { id: string }>,
  res: Response
) => {
  const tagId: string = req.params.id;

  try {
    const deleted = await deleteTag(tagId);

    if (!deleted) {
      return sendResponse(res, 404, null, "Tag not found");
    }

    return sendResponse(res, 200, null, "Tag deleted successfully");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, "Server error");
  }
};
