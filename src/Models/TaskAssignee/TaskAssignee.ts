const mongoose = require('mongoose');
const taskAssigneeSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const TaskAssignee = mongoose.model('TaskAssignee', taskAssigneeSchema);

export default TaskAssignee