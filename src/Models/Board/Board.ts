import { Document, Model, Schema, model } from 'mongoose';

interface ITaskPosition {
  task: Schema.Types.ObjectId;
  position: number;
}
export interface IBoard extends Document {
  name: string;
  project: Schema.Types.ObjectId;
  position: number;
  tasks: ITaskPosition[];
}

const boardSchema = new Schema<IBoard>({
  name: { type: String, required: true },
  position: { type: Number, required: true },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  tasks: [
    {
      task: { type: Schema.Types.ObjectId, ref: 'Task' },
      position: { type: Number, required: true },
    },
  ],
});

export const Board: Model<IBoard> = model('Board', boardSchema);
