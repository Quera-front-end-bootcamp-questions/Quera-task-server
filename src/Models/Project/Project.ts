import { Types } from 'mongoose';
import { Document, Model, Schema, model } from 'mongoose';

interface IBoardPosition {
  board: Schema.Types.ObjectId;
  position: number;
}
export interface IProject extends Document {
  name: string;
  workspace: Types.ObjectId;
  members: Types.ObjectId[];
  boards: IBoardPosition[];
}

const projectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'ProjectMember' }],
  boards: [
    {
      board: { type: Schema.Types.ObjectId, ref: 'Board' },
      position: { type: Number, required: true },
    },
  ],
});

export const Project: Model<IProject> = model('Project', projectSchema);
