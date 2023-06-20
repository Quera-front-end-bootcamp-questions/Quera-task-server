import { Request, Response } from 'express';
import { Types, isValidObjectId } from 'mongoose';
import { sendResponse } from '../../Utils/SendResponse';
import { createBoard } from '../../Repository/BoardRepo/BoardRepository';
import { Board, IBoard, ITaskPosition } from '../../Models/Board/Board';
import {
  IBoardPosition,
  IProject,
  Project,
} from '../../Models/Project/Project';
import { ITask, Task } from '../../Models/Task/Task';
import {
  ITaskAssignee,
  TaskAssignee,
} from '../../Models/TaskAssignee/TaskAssignee';
import { User } from '../../Models/User/User';

export interface ICreateBoardRequestBody {
  name: string;
  boardId: Types.ObjectId;
  description: string;
  deadline: Date;
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

export const createTaskController = async (req: Request, res: Response) => {
  const { name, description, boardId, deadline } = req.body;

  try {
    const BoardToUpdate = await Board.findById(boardId);

    // TODO check user permission
    if (!BoardToUpdate) {
      throw new Error('board not found');
    }
    const maxPosition =
      BoardToUpdate.tasks.length > 0
        ? Math.max(...BoardToUpdate.tasks.map((taskObj) => taskObj.position))
        : 0;

    const task = new Task({
      name,
      board: boardId,
      description,
      deadline,
      position: maxPosition + 1,
    });
    let createdTask = await task.save();

    // Update the tasks field in the project with the new task and its position
    BoardToUpdate.tasks.push({
      task: createdTask._id,
      position: createdTask.position,
    } as ITaskPosition);
    await BoardToUpdate.save();

    const { __v, ...toBeSendBoardData } = task.toObject();

    return sendResponse(
      res,
      201,
      toBeSendBoardData,
      'task created successfully'
    );
  } catch (error) {
    console.error('Error creating task:', error);
    return sendResponse(res, 500, null, 'Server error');
  }
};

export const getAllBoardsController = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    // Fetch all boards and populate tasks
    const boards = await Board.find({ project: projectId })
      .populate({
        path: 'tasks',
        select: '-__v -position -_id',
        populate: {
          path: 'task',
          select: '-__v',
        },
      })
      .exec();

    // If no boards found, return a message
    if (boards.length === 0) {
      return sendResponse(res, 200, [], 'No boards found');
    }

    // Transform the documents: remove __v and populate tasks
    const transformedBoards = boards.map((board) => {
      const boardObject = board.toObject();
      delete boardObject.__v;

      return boardObject;
    });

    // Return the list of boards
    return sendResponse(
      res,
      200,
      transformedBoards,
      'Boards fetched successfully'
    );
  } catch (error) {
    console.error('Error fetching boards:', error);
    return sendResponse(res, 500, null, 'Server error');
  }
};
export const getTaskByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate({
        path: 'comments taskAssigns',
        select: '-__v -task',
        populate: {
          path: 'user',
          select: 'username email profile_url firstname _id',
        },
      })
      .select('-__v');

    if (!task) {
      return sendResponse(res, 400, null, 'task not found.');
    }

    await Task.populate(task, {
      path: 'taskTags',
      select: '-__v -_id -task',
      populate: {
        path: 'tag',
        select: '-__v -tasks',
      },
    });

    return sendResponse(res, 200, task, 'task fetched successfully');
  } catch (error) {
    console.error('Error fetching boards:', error);
    return sendResponse(res, 500, null, 'Server error');
  }
};

export const updateTaskController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, deadline } = req.body;

  try {
    const task: ITask | null = await Task.findById(id);

    if (!task) {
      return sendResponse(res, 404, null, 'task not found');
    }

    task.name = name ? name : task.name;
    task.description = description ? description : task.description;
    task.deadline = deadline ? deadline : task.deadline;

    await task.save();

    // Remove __v from the board
    const taskObject = task.toObject({ getters: true });
    delete taskObject.__v;

    return sendResponse(res, 200, taskObject, 'task updated successfully');
  } catch (error) {
    console.error('Error updating task:', error);
    return sendResponse(res, 500, null, 'Server error');
  }
};

export const updateTaskPositionController = async (
  req: Request,
  res: Response
) => {
  const { id, index } = req.params;

  try {
    const task: ITask | null = await Task.findById(id);

    if (!task) {
      return sendResponse(res, 404, null, 'task not found');
    }

    const newTaskPosition = parseInt(index);
    const oldTaskPosition = task.position;

    const board: IBoard | null = await Board.findById(task.board);

    if (!board) {
      return sendResponse(res, 404, null, 'Board not found');
    }

    // Update the position of the board in the project's boards array
    const updatedTasksPromises = board.tasks.map(async (taskPosition) => {
      if (newTaskPosition > board.tasks.length) {
        sendResponse(res, 404, null, "this position doesn't exist");
      }
      console.log(taskPosition);

      if (taskPosition.task.toString() === id) {
        task.position = newTaskPosition;
        return {
          task: taskPosition.task,
          position: newTaskPosition,
        };
      }

      if (oldTaskPosition < newTaskPosition) {
        // If the board has been moved down the list, decrement the position of the boards between the old and new positions
        if (
          taskPosition.position > oldTaskPosition &&
          taskPosition.position <= newTaskPosition
        ) {
          const updatedTask = await Board.findById(taskPosition.task);
          if (updatedTask) {
            updatedTask.position--;
            await updatedTask.save();
          }
          return {
            task: taskPosition.task,
            position: taskPosition.position - 1,
          };
        }
      } else if (oldTaskPosition > newTaskPosition) {
        // If the board has been moved up the list, increment the position of the boards between the old and new positions
        if (
          taskPosition.position >= newTaskPosition &&
          taskPosition.position < oldTaskPosition
        ) {
          const updatedTask = await Task.findById(taskPosition.task);
          if (updatedTask) {
            updatedTask.position++;
            await updatedTask.save();
          }
          return {
            task: taskPosition.task,
            position: taskPosition.position + 1,
          };
        }
      }

      return taskPosition;
    });

    const updatedTasks = await Promise.all(updatedTasksPromises);

    board.tasks = updatedTasks as ITaskPosition[];
    await board.save();
    await task.save();

    const toBeSendTask = task.toObject();
    delete toBeSendTask.__v;

    return sendResponse(res, 200, toBeSendTask, 'Board updated successfully');
  } catch (error) {
    console.error('Error updating board:', error);
    return sendResponse(res, 500, null, 'Server error');
  }
};

export const moveTaskController = async (req: Request, res: Response) => {
  const { id: taskId, boardId: newBoardId } = req.params;

  try {
    // Convert taskId and newBoardId to ObjectIDs
    const taskIdObj = new Types.ObjectId(taskId);
    const newBoardIdObj = new Types.ObjectId(newBoardId);

    // Ensure taskId and newBoardId are not equal
    if (taskIdObj.equals(newBoardIdObj)) {
      return sendResponse(res, 400, null, 'Cannot move task to the same board');
    }

    // Find the task to be moved
    const task = await Task.findById(taskIdObj);
    if (!task) {
      return sendResponse(res, 404, null, 'Task not found');
    }

    // Store the old position before updating it
    const oldPosition = task.position;

    // Find the old board and remove the task from its tasks array
    const oldBoard = await Board.findById(task.board);
    if (!oldBoard) {
      return sendResponse(res, 404, null, 'Task not found');
    }
    oldBoard.tasks = oldBoard.tasks.filter(
      (t) => t.task.toString() !== taskIdObj._id.toString()
    );

    // Save the old board
    await oldBoard.save();

    // Find the new board and calculate the new position
    const newBoard = await Board.findById(newBoardIdObj);
    if (!newBoard) {
      return sendResponse(res, 404, null, 'Task not found');
    }
    const sortedTasks = newBoard.tasks.sort((a, b) => a.position - b.position);
    const newPosition =
      sortedTasks.length > 0
        ? sortedTasks[sortedTasks.length - 1].position + 1
        : 1;

    // Add the task to the new board's tasks array
    newBoard.tasks.push({
      task: taskIdObj,
      position: newPosition,
    } as ITaskPosition);

    // Save the new board
    await newBoard.save();

    // Update the task's board and position
    task.board = newBoardIdObj;
    task.position = newPosition;

    // Save the task
    await task.save();
    const toBeSendData = task.toObject();
    delete toBeSendData.__v;
    // Update the positions of tasks in the old board
    await Board.updateMany(
      { _id: oldBoard._id, 'tasks.position': { $gt: oldPosition } },
      { $inc: { 'tasks.$[element].position': -1 } },
      { arrayFilters: [{ 'element.position': { $gt: oldPosition } }] }
    );

    return sendResponse(res, 200, toBeSendData, 'task moved to new board');
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, null, 'server error');
  }
};

export const removeTaskController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const task: ITask | null = await Task.findById(id);

    if (!task) {
      return sendResponse(res, 404, null, 'task already deleted');
    }
    console.log('here', task.board);

    const board: IBoard | null = await Board.findById(task.board);
    console.log(board);

    if (!board) {
      return sendResponse(res, 404, null, 'Board not found');
    }

    // Remove the board from the project's boards array
    board.tasks = board.tasks.filter(
      (taskPos) => taskPos.task.toString() !== id
    );

    // Update the positions of the remaining boards in the project and in the Board collection
    const updatedTasksPromises = board.tasks.map(async (taskPos, index) => {
      if (taskPos.position > task.position) {
        taskPos.position--;
      }

      const updatedTask: ITask | null = await Task.findById(taskPos.task);
      if (updatedTask) {
        updatedTask.position = taskPos.position;
        await updatedTask.save();
      }

      return taskPos;
    });

    // Wait for all the promises to resolve
    const updatedTasks = await Promise.all(updatedTasksPromises);

    // Assign the updated boards to the project's boards array
    board.tasks = updatedTasks;

    // Save the updated project
    await board.save();
    const toBeSendData = task.toObject();
    delete toBeSendData.__v;
    // Delete the board
    await task.deleteOne();

    return sendResponse(res, 200, toBeSendData, 'Board deleted successfully');
  } catch (error) {
    console.error('Error deleting board:', error);
    return sendResponse(res, 500, null, 'Server error');
  }
};

export const assignTaskController = async (req: Request, res: Response) => {
  const { taskId, usernameOrId } = req.params;
  let user;

  // Attempt to convert usernameOrId to an ObjectId
  let userId;
  try {
    userId = new Types.ObjectId(usernameOrId);
  } catch (error) {
    userId = null;
  }

  // Query for the user
  if (userId) {
    user = await User.findById(userId);
  } else {
    user = await User.findOne({ username: usernameOrId });
  }

  if (!user) {
    return sendResponse(res, 404, null, 'User not found');
  }

  const task: ITask | null = await Task.findById(taskId).populate({
    path: 'taskAssigns',
    model: 'TaskAssignee', // replace with your actual TaskAssignee model name if different
  });
  if (!task) {
    return sendResponse(res, 404, null, 'Task not found');
  }

  const existingTaskAssignee: ITaskAssignee | null = await TaskAssignee.findOne(
    {
      task: taskId,
      user: user._id,
    }
  );

  if (existingTaskAssignee) {
    return sendResponse(res, 400, null, 'Task already assigned to this user');
  }

  const newTaskAssignee: ITaskAssignee = new TaskAssignee({
    task: taskId,
    user: user._id,
  });

  await newTaskAssignee.save();

  task.taskAssigns.push(newTaskAssignee._id);
  await task.save();

  await task.populate({
    path: 'taskAssigns',
    model: 'TaskAssignee',
    select: '-__v -task -_id',
    populate: {
      path: 'user',
      model: 'User',
      select: 'username _id',
    }, // replace with your actual TaskAssignee model name if different
  });

  user.taskAssignees.push(newTaskAssignee._id);
  await user.save();

  const { username, _id } = user.toObject();
  const { __v, ...toBeSendTaskData } = task.toObject();

  return sendResponse(
    res,
    200,
    { task: toBeSendTaskData, user: { username, _id } },
    'Task assigned to user'
  );
};

export const unassignTaskController = async (req: Request, res: Response) => {
  try {
    // Extract task id and user identifier from parameters
    const { taskId, usernameOrId } = req.params;

    // Try to parse usernameOrId as an ObjectId. If it fails, treat it as a username.
    let userId;
    if (isValidObjectId(usernameOrId)) {
      userId = new Types.ObjectId(usernameOrId);
    } else {
      const user = await User.findOne({ username: usernameOrId });
      if (!user) {
        return sendResponse(res, 404, null, 'User not found.');
      }
      userId = user._id;
    }

    // Check if the task is assigned to the user
    const assignee = await TaskAssignee.findOne({ task: taskId, user: userId });
    if (!assignee) {
      return sendResponse(res, 400, null, 'Task is not assigned to the user.');
    }

    // Remove the task assignee
    await TaskAssignee.findByIdAndRemove(assignee._id);

    // Update the task and user to remove the reference to the task assignee
    await Task.findByIdAndUpdate(taskId, {
      $pull: { taskAssigns: assignee._id },
    });
    await User.findByIdAndUpdate(userId, {
      $pull: { taskAssignees: assignee._id },
    });
    return sendResponse(res, 200, null, 'Task unassigned successfully.');
  } catch (error) {
    res.status(500).send({ message: 'An error occurred.' });
  }
};
