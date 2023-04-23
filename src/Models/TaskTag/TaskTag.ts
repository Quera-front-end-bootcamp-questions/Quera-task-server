const mongoose = require('mongoose');
const taskTagSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  tagId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: true }
});

const TaskTag = mongoose.model('TaskTag', taskTagSchema);
export default TaskTag