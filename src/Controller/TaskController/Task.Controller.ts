import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { sendResponse } from '../../Utils/SendResponse';
import { createBoard } from '../../Repository/BoardRepo/BoardRepository';
import { Board, IBoard, ITaskPosition } from '../../Models/Board/Board';
import {
  IBoardPosition,
  IProject,
  Project,
} from '../../Models/Project/Project';
import { ITask, Task } from '../../Models/Task/Task';

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

export const updateBoardController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const board: IBoard | null = await Board.findById(id).populate({
      path: 'tasks',
      select: '-__v -_id',
      populate: {
        path: 'task',
        select: '-__v',
      },
    });

    if (!board) {
      return sendResponse(res, 404, null, 'Board not found');
    }

    if (name !== undefined) {
      // Only update name if it's provided
      board.name = name;
    }

    await board.save();

    // Remove __v from the board
    const boardObject = board.toObject({ getters: true });
    delete boardObject.__v;

    return sendResponse(res, 200, boardObject, 'Board updated successfully');
  } catch (error) {
    console.error('Error updating board:', error);
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
          ...taskPosition,
          task: taskPosition.task,
          position: newTaskPosition,
        };
      }

      if (oldTaskPosition < newTaskPosition) {
        // If the board has been moved down the list, decrement the position of the boards between the old and new positions
        if (
          taskPosition.position > oldTaskPosition &&
          taskPosition.position < newTaskPosition
        ) {
          const updatedTask = await Board.findById(taskPosition.task);
          if (updatedTask) {
            updatedTask.position--;
            await updatedTask.save();
          }
          return {
            ...taskPosition,
            position: taskPosition.position - 1,
          };
        }
      } else if (oldTaskPosition > newTaskPosition) {
        // If the board has been moved up the list, increment the position of the boards between the old and new positions
        if (
          taskPosition.position > newTaskPosition &&
          taskPosition.position < oldTaskPosition
        ) {
          const updatedTask = await Board.findById(taskPosition.task);
          if (updatedTask) {
            updatedTask.position++;
            await updatedTask.save();
          }
          return {
            ...taskPosition,
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

export const getBoardTasksController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const board: IBoard | null = await Board.findById(id).populate({
      path: 'tasks.task',
      select: '-__v -_id',
    });

    if (!board) {
      return sendResponse(res, 404, null, 'Board not found');
    }

    // Remove __v from each task if it exists
    const toBeSendBoard = board;
    const tasks = toBeSendBoard.tasks.map((taskObject) => {
      let task = taskObject.task as ITask;
      if (typeof task === 'object') {
        delete task.__v;
      }
      return { position: taskObject.position, task };
    });

    return sendResponse(res, 200, tasks, 'Tasks retrieved successfully');
  } catch (error) {
    console.error('Error getting tasks:', error);
    return sendResponse(res, 500, null, 'Server error');
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
