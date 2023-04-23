const mongoose = require('mongoose');
const projectMemberSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: String
});

const ProjectMember = mongoose.model('ProjectMember', projectMemberSchema);

export default ProjectMember;