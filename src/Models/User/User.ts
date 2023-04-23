const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  firstname: String,
  lastname: String,
  email: String,
  password_hash: { type: String, required: true },
  profile_url: String,
  phone: String,
  password_reset_token: String, // Add this line to define the password_reset_token field
  workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' }],
  workspaceMember: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkspaceMember' }],
  taskAssignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TaskAssignee' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  settings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Setting' }],
  projectMember: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectMember' }]
});

const User = mongoose.model('User', userSchema);

export default User;
