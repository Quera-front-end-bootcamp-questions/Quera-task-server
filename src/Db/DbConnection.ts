const mongoose = require("mongoose");
const { User } = require('../Models/User/User');
const { Workspace } = require('../Models/Workspace/Workspace');
const { WorkspaceMember } = require('../Models/WorkspaceMember/WorkspaceMember');
const { TaskTag } = require('../Models/TaskTag/TaskTag');
const { TaskAssignee } = require('../Models/TaskAssignee/TaskAssignee');
const { Setting } = require('../Models/Setting/Setting');
const { ProjectMember } = require('../Models/ProjectMember/ProjectMember');
const { Board } = require('../Models/Board/Board');
const { Task } = require('../Models/Task/Task');
const { Tag } = require('../Models/Tag/Tag');
const { Comment } = require('../Models/Comment/Comment');

const DATABASE_URL = "mongodb://localhost:27017/quera-trello";

// const DATABASE_URL = "mongodb://0.0.0.0:27017/quera-trello";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database successfully!");
    // Initialize tables
    await User.init();
    await Workspace.init();
    await WorkspaceMember.init();
    await TaskTag.init();
    await TaskAssignee.init();
    await Setting.init();
    await ProjectMember.init();
    await Board.init();
    await Task.init();
    await Tag.init();
    await Comment.init();
  } catch (error: any) {
    console.log("Error connecting to the database:", error.message);
  }
};

export default connectToDatabase;
