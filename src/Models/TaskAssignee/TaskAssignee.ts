import { Schema, model, Types, Document, Model } from 'mongoose';

export interface ITaskAssignee extends Document {
  task: Types.ObjectId;
  user: Types.ObjectId;
}

const taskAssigneeSchema = new Schema<ITaskAssignee>({
  task: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export const TaskAssignee: Model<ITaskAssignee> = model<ITaskAssignee>('TaskAssignee', taskAssigneeSchema);
