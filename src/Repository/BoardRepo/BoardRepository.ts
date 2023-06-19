import { Model, Types } from 'mongoose';
import { ICreateBoardRequestBody } from '../../Controller/BoardController/Board.Controller';
import { Board, IBoard } from '../../Models/Board/Board';
import { Project } from '../../Models/Project/Project';

// Create a board
const createBoard = async (
  name: string,
  projectId: Types.ObjectId,
  userId: Types.ObjectId,
  color: string
): Promise<Partial<IBoard>> => {
  try {
    const projectToUpdate = await Project.findById(projectId);

    // TODO check user permission
    if (!projectToUpdate) {
      throw new Error('Project not found');
    }
    const maxPosition =
      projectToUpdate.boards.length > 0
        ? Math.max(...projectToUpdate.boards.map((board) => board.position))
        : 0;

    const board = new Board({
      name,
      color,
      project: projectId,
      position: maxPosition + 1,
    });
    let createdBoard = await board.save();

    // Update the boards field in the project with the new board and its position
    projectToUpdate.boards.push({
      board: createdBoard._id,
      position: createdBoard.position,
    });
    await projectToUpdate.save();

    const { __v, ...toBeSendBoardData } = board.toObject();

    return toBeSendBoardData;
  } catch (error) {
    console.error('Error creating board:', error);
    throw error;
  }
};

// Get a board by ID
const getBoardById = async (
  boardId: Types.ObjectId 
  //@ts-ignore
): Promise<IBoard | null> => {
  // Implement the logic to retrieve a board by its ID
};

// Update a board
const updateBoard = async (
  boardId: Types.ObjectId,
  updates: Partial<ICreateBoardRequestBody>
   //@ts-ignore
): Promise<IBoard> => {
  // Implement the logic to update a board
};
//@ts-expect-error
// Delete a board
const deleteBoard = async (boardId: Types.ObjectId): Promise<IBoard> => {
  // Implement the logic to delete a board
};

export { createBoard, getBoardById, updateBoard, deleteBoard };
