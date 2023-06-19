import { Document, Model, Schema, Types, model } from 'mongoose';
import { ITask } from '../Task/Task';

export interface ITaskPosition extends Document {
  task: Types.ObjectId | ITask;
  position: number;
}
export interface IBoard extends Document {
  name: string;
  project: Types.ObjectId;
  position: number;
  tasks: ITaskPosition[];
  color: string;
}

const boardSchema = new Schema<IBoard>({
  name: { type: String, required: true },
  position: { type: Number, required: true },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  color: { type: String, default: '#0000ff' },
  tasks: [
    {
      task: { type: Schema.Types.ObjectId, ref: 'Task' },
      position: { type: Number, required: true },
    },
  ],
});

export const Board: Model<IBoard> = model('Board', boardSchema);
