import { Request, Response } from 'express';
import {
  createTag,
  deleteTag,
  getTagById,
  getTagsByTaskId,
  updateTag,
} from '../../Repository/TagRepo/TagRepository';
import { sendResponse } from '../../Utils/SendResponse';
import { Task } from '../../Models/Task/Task';
import { TaskTag } from '../../Models/TaskTag/TaskTag';
import { Tag } from '../../Models/Tag/Tag';

export const createTagController = async (req: Request, res: Response) => {
  const { name, taskId, color } = req.body;

  try {
    // Find existing tag
    let tag = await Tag.findOne({ name }).select('-__v');

    // If tag doesn't exist, create a new one
    if (!tag) {
      tag = new Tag({ name, color });
      await tag.save();
    }

    // Check if a TaskTag with the same task and tag already exists
    const existingTaskTag = await TaskTag.findOne({
      task: taskId,
      tag: tag._id,
    });
    if (existingTaskTag) {
      return res
        .status(400)
        .json({ message: 'This task has already been tagged with this tag' });
    }

    // Create a new TaskTag
    const taskTag = new TaskTag({
      task: taskId,
      tag: tag._id,
    });

    await taskTag.save();

    // Add the TaskTag to the tasks array in the Tag document
    tag.tasks.push(taskTag._id);
    await tag.save();

    // Add the TaskTag to the taskTags array in the Task document
    const task = await Task.findById(taskId);
    if (!task) {
      return sendResponse(res, 404, null, 'task not found.');
    }
    task.taskTags.push(taskTag._id);
    await task.save();

    // Fetch all TaskTag objects associated with the tag, including their associated Task details
    const taskTags = await TaskTag.find({ _id: { $in: tag.tasks } }).populate(
      'task',
      '_id name description'
    );

    // Create an array of task details
    let taskDetails: any = taskTags.map((taskTag) => ({
      task: taskTag.task,
    }));

    taskDetails = taskDetails.map((taskObj: any) => {
      return taskObj.task;
    });

    sendResponse(
      res,
      201,
      {
        tag: { _id: tag._id, name: tag.name, color: tag.color },
        tasks: taskDetails,
      },
      'Tag created and associated successfully'
    );
  } catch (error) {
    sendResponse(res, 500, null, 'An error occurred while creating the tag');
  }
};

export const untagTaskController = async (req: Request, res: Response) => {
  const { taskId, name } = req.body;

  try {
    // Find the tag
    const tag = await Tag.findOne({ name });

    // If tag doesn't exist, send a message
    if (!tag) {
      return res.status(400).json({ message: 'Tag does not exist' });
    }

    // Find the TaskTag with the same task and tag
    const taskTag = await TaskTag.findOne({ task: taskId, tag: tag._id });

    // If TaskTag doesn't exist, send a message
    if (!taskTag) {
      return res
        .status(400)
        .json({ message: 'This task is not tagged with this tag' });
    }

    // Remove the TaskTag
    await TaskTag.deleteOne({ _id: taskTag._id });

    // Remove the TaskTag from the tasks array in the Tag document
    const tagIndex = tag.tasks.indexOf(taskTag._id);
    if (tagIndex > -1) {
      tag.tasks.splice(tagIndex, 1);
    }

    if (tag.tasks.length === 0) {
      // If the tag has no more tasks, delete it
      await Tag.deleteOne({ _id: tag._id });
    } else {
      // Otherwise, save the updated tag
      await tag.save();
    }

    // Remove the TaskTag from the taskTags array in the Task document
    const task = await Task.findById(taskId);
    if (!task) {
      return sendResponse(res, 404, null, 'Task not found.');
    }
    const taskIndex = task.taskTags.indexOf(taskTag._id);
    if (taskIndex > -1) {
      task.taskTags.splice(taskIndex, 1);
    }
    await task.save();

    sendResponse(
      res,
      200,
      { taskName: task.name, taskId: task._id, tagName: tag.name },
      'Tag removed successfully'
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error occurred while removing the tag', error });
  }
};

export const getTagByIdController = async (req: Request, res: Response) => {
  const { tagIdOrName } = req.params;

  // Determine if the input is an ObjectId or a regular string
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(tagIdOrName);

  try {
    let tag;
    if (isObjectId) {
      // If it's an ObjectId, find the tag by its ID
      tag = await Tag.findById(tagIdOrName);
    } else {
      // If it's a regular string, find the tag by its name
      tag = await Tag.findOne({ name: tagIdOrName });
    }

    // If tag doesn't exist, send a message
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // Get the TaskTags related to this tag
    const taskTags: any = await TaskTag.find({ tag: tag._id }).populate('task');

    // Map the tasks to the desired format
    const tasks = taskTags.map((taskTag: any) => ({
      _id: taskTag.task._id,
      name: taskTag.task.name,
      description: taskTag.task.description,
    }));

    sendResponse(
      res,
      200,
      {
        _id: tag._id,
        name: tag.name,
        color: tag.color,
        tasks,
      },
      'Tag data retrieved successfully.'
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error occurred while fetching the tag', error });
  }
};

export const getTagsByTaskIdController = async (
  req: Request,
  res: Response
) => {
  const { taskId } = req.params;

  try {
    // Find the task by its ID
    const task = await Task.findById(taskId);

    // If task doesn't exist, send a message
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Find all associated TaskTags
    const taskTags: any = await TaskTag.find({ task: task._id }).populate(
      'tag'
    );

    // Create an array of tag details
    const tags = taskTags.map((taskTag: any) => ({
      tagName: taskTag.tag.name,
      _id: taskTag._id,
      color: taskTag.tag.color,
    }));

    // Send the task details and associated tags
    sendResponse(
      res,
      200,
      {
        _id: task._id,
        name: task.name,
        description: task.description,
        tags,
      },
      'tag of required task fetched successfully'
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error occurred while fetching the tags', error });
  }
};

export const updateTagController = async (req: Request, res: Response) => {
  const { tagIdOrName } = req.params;
  const { name, color } = req.body;

  // Determine if the input is an ObjectId or a regular string
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(tagIdOrName);

  try {
    let tag;
    if (isObjectId) {
      // If it's an ObjectId, find the tag by its ID
      tag = await Tag.findById(tagIdOrName).select('-__v');
    } else {
      // If it's a regular string, find the tag by its name
      tag = await Tag.findOne({ name: tagIdOrName });
    }

    // If tag doesn't exist, send a message
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // Update the tag
    if (name !== undefined) {
      tag.name = name;
    }
    if (color !== undefined) {
      tag.color = color;
    }

    // Save the tag
    await tag.save();

    res.status(200).json({
      message: 'Tag updated successfully',
      tag,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error occurred while updating the tag', error });
  }
};
export const deleteTagController = async (req: Request, res: Response) => {
  const { tagIdOrName } = req.params;

  // Determine if the input is an ObjectId or a regular string
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(tagIdOrName);

  try {
    let tag;
    if (isObjectId) {
      // If it's an ObjectId, find the tag by its ID
      tag = await Tag.findById(tagIdOrName);
    } else {
      // If it's a regular string, find the tag by its name
      tag = await Tag.findOne({ name: tagIdOrName });
    }

    // If tag doesn't exist, send a message
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // Find all associated TaskTags
    const taskTags = await TaskTag.find({ tag: tag._id });

    // For each TaskTag, remove its reference in the Task document
    for (let taskTag of taskTags) {
      await Task.updateOne(
        { _id: taskTag.task },
        { $pull: { taskTags: taskTag._id } }
      );
    }

    // Delete associated TaskTags
    await TaskTag.deleteMany({ tag: tag._id });

    // Delete the tag
    await tag.deleteOne();

    res.status(200).json({
      message: 'Tag and associated TaskTags deleted successfully',
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error occurred while deleting the tag', error });
  }
};
