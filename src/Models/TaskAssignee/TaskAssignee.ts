import { Schema, model, Types, Document, Model } from 'mongoose';

export interface ITaskAssignee extends Document {
  taskId: Types.ObjectId;
  userId: Types.ObjectId;
}

const taskAssigneeSchema = new Schema<ITaskAssignee>({
  taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export const TaskAssignee: Model<ITaskAssignee> = model<ITaskAssignee>('TaskAssignee', taskAssigneeSchema);
