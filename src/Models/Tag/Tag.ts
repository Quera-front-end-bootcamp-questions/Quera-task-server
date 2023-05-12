import { Schema, model, Types, Document, Model } from 'mongoose';

export interface ITag extends Document {
  name: string;
  tasks: Types.ObjectId[];
}

const tagSchema = new Schema<ITag>({
  name: { type: String, required: true },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'TaskTag' }]
});

export const Tag: Model<ITag> = model<ITag>('Tag', tagSchema);
