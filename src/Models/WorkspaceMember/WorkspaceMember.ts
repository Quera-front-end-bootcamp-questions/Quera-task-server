// models/WorkspaceMember.ts
import { Document, Model, Schema, Types, model } from 'mongoose';

export interface IWorkspaceMember extends Document {
  userId: Types.ObjectId;
  workspaceId: Types.ObjectId;
}

const workspaceMemberSchema = new Schema<IWorkspaceMember>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true }
});

export const WorkspaceMember: Model<IWorkspaceMember> = model('WorkspaceMember', workspaceMemberSchema);
