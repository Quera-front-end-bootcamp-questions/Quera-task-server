const mongoose = require('mongoose');
const boardSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  position: Number,
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
});

const Board = mongoose.model('Board', boardSchema);

export default Board