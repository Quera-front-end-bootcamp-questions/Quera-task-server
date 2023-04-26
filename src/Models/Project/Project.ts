const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectMember' }],
  boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }]
});

const Project = mongoose.model('Project', projectSchema);

export default Project;