// models/WorkspaceMember.ts
import { Document, Model, Schema, Types, model } from 'mongoose';

export interface IWorkspaceMember extends Document {
  user: Types.ObjectId;
  workspace: Types.ObjectId;
}

const workspaceMemberSchema = new Schema<IWorkspaceMember>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true }
});

export const WorkspaceMember: Model<IWorkspaceMember> = model('WorkspaceMember', workspaceMemberSchema);
