const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  deadline: Date,
  label: String,
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  taskTags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TaskTag' }],
  taskAssigns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TaskAssignee' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

const Task = mongoose.model('Task', taskSchema);

export default Task