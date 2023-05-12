import express, { RequestHandler, Response } from 'express';

import { verifyToken } from '../../Middleware/Authenticate';
import { createBoardController } from '../../Controller/BoardController/Board.Controller';

type AuthenticatedCreateRequestHandler = RequestHandler<
  any,
  Response
//   IAuthenticatedCreateRequest
>;
type AuthenticatedUpdateRequestHandler = RequestHandler<
  any,
  Response
//   IAuthenticatedUpdateRequest
>;
type AuthenticatedRequestHandler = RequestHandler<
  any,
  Response
//   IAuthenticatedRequest
>;



const router = express.Router();

// Create a board
router.post('/create', verifyToken, createBoardController as any);

// Get a board by ID
// router.get('/:id', verifyToken, getBoardByIdController);

// // Update a board
// router.patch('/:id', verifyToken, updateBoardController);

// // Delete a board
// router.delete('/:id', verifyToken, deleteBoardController);



export default router;