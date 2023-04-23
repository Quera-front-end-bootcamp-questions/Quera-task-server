const mongoose = require('mongoose');
const workspaceSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  image: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkspaceMember' }],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
});

const Workspace = mongoose.model('Workspace', workspaceSchema);

export default Workspace