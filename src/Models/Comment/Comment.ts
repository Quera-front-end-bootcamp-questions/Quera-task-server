import { Schema, model, Types, Document, Model } from 'mongoose';

export interface IComment extends Document {
  text: string;
  createdAt: Date;
  user: Types.ObjectId;
  task: Types.ObjectId;
}

const commentSchema = new Schema<IComment>({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: Schema.Types.ObjectId, ref: 'Task', required: true }
});

export const Comment: Model<IComment> = model<IComment>('Comment', commentSchema);
