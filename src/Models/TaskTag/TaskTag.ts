import { Schema, model, Types, Document, Model } from 'mongoose';

export interface ITaskTag extends Document {
  task: Types.ObjectId;
  tag: Types.ObjectId;
}

const taskTagSchema = new Schema<ITaskTag>({
  task: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  tag: { type: Schema.Types.ObjectId, ref: 'Tag', required: true }
});

export const TaskTag: Model<ITaskTag> = model<ITaskTag>('TaskTag', taskTagSchema);