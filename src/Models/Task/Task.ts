import { Schema, model, Types, Document, Model } from 'mongoose';

export interface ITask extends Document {
  name: string;
  description: string;
  board: Types.ObjectId;
  position: number;
  label: Types.ObjectId[];
  deadline: Date;
  taskTags: Types.ObjectId[];
  taskAssigns: Types.ObjectId[];
  comments: Types.ObjectId[];
}

const taskSchema = new Schema<ITask>({
  name: { type: String, required: true },
  description: { type: String },
  deadline: Date,
  label: [String],
  board: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
  taskTags: [{ type: Schema.Types.ObjectId, ref: 'TaskTag' }],
  taskAssigns: [{ type: Schema.Types.ObjectId, ref: 'TaskAssignee' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  position: { type: Number, required: true },
});

export const Task: Model<ITask> = model('Task', taskSchema);
