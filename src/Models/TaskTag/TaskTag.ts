import { Schema, model, Types, Document, Model } from 'mongoose';

export interface ITaskTag extends Document {
  taskId: Types.ObjectId;
  tagId: Types.ObjectId;
}

const taskTagSchema = new Schema<ITaskTag>({
  taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  tagId: { type: Schema.Types.ObjectId, ref: 'Tag', required: true }
});

export const TaskTag: Model<ITaskTag> = model<ITaskTag>('TaskTag', taskTagSchema);