import express, { RequestHandler, Response } from 'express';

import { verifyToken } from '../../Middleware/Authenticate';
import { changeBoardPositionController, createBoardController, deleteBoardController, getAllBoardsController, getBoardTasksController, updateBoardController } from '../../Controller/BoardController/Board.Controller';

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


router.post('/', verifyToken, createBoardController as any);
router.get('/:projectId', verifyToken, getAllBoardsController); 
router.put('/:id', verifyToken, updateBoardController); 
router.put('/:id/position/:index', verifyToken, changeBoardPositionController); 
router.get('/:id/tasks', verifyToken, getBoardTasksController); 
router.delete('/:id', verifyToken, deleteBoardController); 

export default router;