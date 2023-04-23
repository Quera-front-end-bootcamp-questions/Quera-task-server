const mongoose = require("mongoose");
const workspaceMemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
});

const WorkspaceMember = mongoose.model(
  "WorkspaceMember",
  workspaceMemberSchema
);
export default WorkspaceMember;
