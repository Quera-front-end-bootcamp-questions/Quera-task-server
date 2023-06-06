import { Request, Response } from 'express';
import { Types, model } from 'mongoose';
import { sendResponse } from '../../Utils/SendResponse';
import { createBoard } from '../../Repository/BoardRepo/BoardRepository';
import { Board, IBoard, ITaskPosition } from '../../Models/Board/Board';
import {
  IBoardPosition,
  IProject,
  Project,
} from '../../Models/Project/Project';
import { ITask } from '../../Models/Task/Task';

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
          populate: {
            path: 'comments taskAssigns',
            select: '-__v -task',
          }
        },
      })
      .exec();

    // If no boards found, return a message
    if (boards.length === 0) {
      return sendResponse(res, 200, [], 'No boards found');
    }

    // Transform the documents: remove __v and populate tasks
    const transformedBoards = boards.map((board) => {
      const { __v, ...boardObject } = board.toObject();

      boardObject.tasks = boardObject.tasks.map((taskObject: any) => {
        // delete taskObject.task.comments;
        taskObject.task.taskAssigns = taskObject.task.taskAssigns.map((taskAssign: any) =>{
          return taskAssign.user
        });
        return taskObject.task;
      }) as unknown as ITaskPosition[];

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

export const changeBoardPositionController = async (
  req: Request,
  res: Response
) => {
  const { id, index } = req.params;

  try {
    const board: IBoard | null = await Board.findById(id);

    if (!board) {
      return sendResponse(res, 404, null, 'Board not found');
    }

    const newBoardPosition = parseInt(index);
    const oldBoardPosition = board.position;

    const project: IProject | null = await Project.findById(board.project);

    if (!project) {
      return sendResponse(res, 404, null, 'Project not found');
    }

    // Update the position of the board in the project's boards array
    const updatedBoardsPromises = project.boards.map(async (boardPosition) => {
      if (newBoardPosition > project.boards.length) {
        sendResponse(res, 404, null, "this position doesn't exist");
      }
      if (boardPosition.board.toString() === id) {
        board.position = newBoardPosition;
        return { board: boardPosition.board, position: newBoardPosition };
      }

      if (oldBoardPosition < newBoardPosition) {
        // If the board has been moved down the list, decrement the position of the boards between the old and new positions
        if (
          boardPosition.position > oldBoardPosition &&
          boardPosition.position <= newBoardPosition
        ) {
          const updatedBoard = await Board.findById(boardPosition.board);
          if (updatedBoard) {
            updatedBoard.position--;
            await updatedBoard.save();
          }
          return {
            board: boardPosition.board,
            position: boardPosition.position - 1,
          };
        }
      } else if (oldBoardPosition > newBoardPosition) {
        // If the board has been moved up the list, increment the position of the boards between the old and new positions
        if (
          boardPosition.position >= newBoardPosition &&
          boardPosition.position < oldBoardPosition
        ) {
          const updatedBoard = await Board.findById(boardPosition.board);
          if (updatedBoard) {
            updatedBoard.position++;
            await updatedBoard.save();
          }
          return {
            board: boardPosition.board,
            position: boardPosition.position + 1,
          };
        }
      }

      return boardPosition;
    });

    const updatedBoards = await Promise.all(updatedBoardsPromises);

    project.boards = updatedBoards;
    await project.save();
    await board.save();

    // Populate tasks
    await board.populate('tasks.task');

    // Remove __v from each task
    const toBeSendBoard = board.toObject();
    toBeSendBoard.tasks = board.tasks.map((taskObject) => {
      const task = taskObject.task as ITask;
      delete task.__v;
      return { position: taskObject.position, task };
    });

    const boardObject = board.toObject();

    // Remove __v from the board
    delete boardObject.__v;

    return sendResponse(res, 200, boardObject, 'Board updated successfully');
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
      select: '-__v ',
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
      return task;
    });

    return sendResponse(res, 200, tasks, 'Tasks retrieved successfully');
  } catch (error) {
    console.error('Error getting tasks:', error);
    return sendResponse(res, 500, null, 'Server error');
  }
};

export const deleteBoardController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const board: IBoard | null = await Board.findById(id);

    if (!board) {
      return sendResponse(res, 404, null, 'Board not found');
    }

    const project: IProject | null = await Project.findById(board.project);

    if (!project) {
      return sendResponse(res, 404, null, 'Project not found');
    }

    // Remove the board from the project's boards array
    project.boards = project.boards.filter(
      (boardPosition) => boardPosition.board.toString() !== id
    );

    // Update the positions of the remaining boards in the project and in the Board collection
    const updatedBoardsPromises = project.boards.map(
      async (boardPosition, index) => {
        if (boardPosition.position > board.position) {
          boardPosition.position--;
        }

        const updatedBoard: IBoard | null = await Board.findById(
          boardPosition.board
        );
        if (updatedBoard) {
          updatedBoard.position = boardPosition.position;
          await updatedBoard.save();
        }

        return boardPosition;
      }
    );

    // Wait for all the promises to resolve
    const updatedBoards = await Promise.all(updatedBoardsPromises);

    // Assign the updated boards to the project's boards array
    project.boards = updatedBoards;

    // Save the updated project
    await project.save();
    const toBeSendData = board.toObject();
    delete toBeSendData.__v;
    // Delete the board
    await board.deleteOne();

    return sendResponse(res, 200, toBeSendData, 'Board deleted successfully');
  } catch (error) {
    console.error('Error deleting board:', error);
    return sendResponse(res, 500, null, 'Server error');
  }
};
