import { Schema, model, Types, Document, Model } from 'mongoose';

export interface ITag extends Document {
  name: string;
  tasks: Types.ObjectId[];
  color: string
}

const tagSchema = new Schema<ITag>({
  name: { type: String, required: true },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'TaskTag' }],
  color: {type: String, default: '#0000FF'}
});

export const Tag: Model<ITag> = model<ITag>('Tag', tagSchema);
