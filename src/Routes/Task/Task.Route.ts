import express from 'express';
import { verifyToken } from '../../Middleware/Authenticate';
import { createTaskController, removeTaskController, updateTaskPositionController } from '../../Controller/TaskController/Task.Controller';


const router = express.Router();

router.post('/', verifyToken, createTaskController as any); 
router.delete('/:id', verifyToken, removeTaskController); 
router.put('/:id/position/:index', verifyToken, updateTaskPositionController); 
// router.put('/:id', verifyToken, updateTaskController); 
// router.put('/:id/board', verifyToken, changeTaskBoardController); 
// router.put('/:id/assign/:userId', verifyToken, assignTaskController); 

export default router;