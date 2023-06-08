import express from 'express';
import { verifyToken } from '../../Middleware/Authenticate';
import {
  assignTaskController,
  createTaskController,
  getTaskByIdController,
  moveTaskController,
  removeTaskController,
  unassignTaskController,
  updateTaskController,
  updateTaskPositionController,
} from '../../Controller/TaskController/Task.Controller';

const router = express.Router();

router.get('/:id', verifyToken, getTaskByIdController as any);
router.post('/', verifyToken, createTaskController as any);
router.delete('/:id', verifyToken, removeTaskController);
router.put('/:id/position/:index', verifyToken, updateTaskPositionController);
router.put('/:id', verifyToken, updateTaskController);
router.put('/:id/board/:boardId', verifyToken, moveTaskController);
router.put('/:taskId/assign/:usernameOrId', verifyToken, assignTaskController);
router.delete('/:taskId/assign/:usernameOrId', verifyToken, unassignTaskController);

export default router;
