// models/WorkspaceMember.ts
import { Document, Model, Schema, model } from 'mongoose';

export interface IWorkspaceMember extends Document {
  userId: Schema.Types.ObjectId;
  workspaceId: Schema.Types.ObjectId;
}

const workspaceMemberSchema = new Schema<IWorkspaceMember>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true }
});

export const WorkspaceMember: Model<IWorkspaceMember> = model('WorkspaceMember', workspaceMemberSchema);
