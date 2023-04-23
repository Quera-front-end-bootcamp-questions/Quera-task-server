const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true }
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;