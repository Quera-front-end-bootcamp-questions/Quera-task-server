// models/Workspace.ts
import { Document, Model, Schema, Types, model } from 'mongoose';

export interface IWorkspace extends Document {
  name: string;
  createdAt: Date;
  image?: string;
  user: any;
  members: Types.ObjectId[];
  projects: Types.ObjectId[];
  color: string;
}

const workspaceSchema = new Schema<IWorkspace>({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  image: String,
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [
    { type: Schema.Types.ObjectId, ref: 'WorkspaceMember', default: [] },
  ],
  color: { type: String, default: '#0000ff' },
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
});

// Add pre middleware for findOneAndUpdate and updateMany operations
workspaceSchema.pre(['findOneAndUpdate', 'updateMany'], function (next) {
  const update = this.getUpdate();
  if (update && 'createdAt' in update) {
    delete update.createdAt;
  }
  next();
});

export const Workspace: Model<IWorkspace> = model('Workspace', workspaceSchema);
