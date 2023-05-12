import { Schema, model, Types, Document, Model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  password_hash: string;
  profile_url?: string;
  phone?: string;
  password_reset_token?: string;
  workspaces: Types.ObjectId[];
  workspaceMember: Types.ObjectId[];
  taskAssignees: Types.ObjectId[];
  comments: Types.ObjectId[];
  settings: Types.ObjectId[];
  projectMember: Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  firstname: String,
  lastname: String,
  email: {type: String, required: true, unique: true},
  password_hash: { type: String, required: true },
  profile_url: String,
  phone: String,
  password_reset_token: String,
  workspaces: [{ type: Schema.Types.ObjectId, ref: 'Workspace' }],
  workspaceMember: [{ type: Schema.Types.ObjectId, ref: 'WorkspaceMember' }],
  taskAssignees: [{ type: Schema.Types.ObjectId, ref: 'TaskAssignee' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  settings: [{ type: Schema.Types.ObjectId, ref: 'Setting' }],
  projectMember: [{ type: Schema.Types.ObjectId, ref: 'ProjectMember' }]
});

export const User: Model<IUser> = model<IUser>('User', userSchema);
