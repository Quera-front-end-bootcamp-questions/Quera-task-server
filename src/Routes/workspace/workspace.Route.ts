import express, { RequestHandler, Response } from 'express';
import {
  IAuthenticatedCreateRequest,
  IAuthenticatedRequest,
  IAuthenticatedUpdateRequest,
  addWorkspaceMemberController,
  createWorkspaceController,
  deleteWorkspaceController,
  getAllUserWorkspacesController,
  getWorkspaceByIdController,
  removeWorkspaceMemberController,
  updateWorkspaceController,
} from '../../Controller/workspaceController/workspace.Controller';
import { verifyToken } from '../../Middleware/Authenticate';

type AuthenticatedCreateRequestHandler = RequestHandler<
  any,
  Response,
  IAuthenticatedCreateRequest
>;
type AuthenticatedUpdateRequestHandler = RequestHandler<
  any,
  Response,
  IAuthenticatedUpdateRequest
>;
type AuthenticatedRequestHandler = RequestHandler<
  any,
  Response,
  IAuthenticatedRequest
>;

const router = express.Router();

router.post(
  '/create',
  verifyToken,
  createWorkspaceController as unknown as AuthenticatedCreateRequestHandler
);
router.get(
  '/get-all',
  verifyToken,
  getAllUserWorkspacesController as unknown as AuthenticatedRequestHandler
);

router.get(
  '/:id',
  verifyToken,
  getWorkspaceByIdController as unknown as AuthenticatedRequestHandler
);

router.patch(
  '/:id',
  verifyToken,
  updateWorkspaceController as unknown as AuthenticatedUpdateRequestHandler
);
router.put(
  '/:workspaceId/members/:usernameOrId',
  verifyToken,
  addWorkspaceMemberController
);

router.delete(
  '/:id',
  verifyToken,
  deleteWorkspaceController as unknown as AuthenticatedRequestHandler
);
router.delete(
  '/:workspaceId/members/:usernameOrId',
  verifyToken,
  removeWorkspaceMemberController as unknown as AuthenticatedRequestHandler
);

export default router;
