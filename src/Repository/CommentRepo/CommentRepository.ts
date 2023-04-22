import Comment from '../../Models/Comment/Comment';
import User from '../../Models/User/User';
import Task from '../../Models/Task/Task';

const createComment = async (text: string, userId: string, taskId: string): Promise<any> => {
  const comment = await Comment.create({
    text,
    user: userId,
    task: taskId,
  });

  return comment;
};

const getCommentById = async (id: string): Promise<any> => {
  const comment = await Comment.findById(id).populate('user').populate('task');

  return comment;
};

const getCommentsByTaskId = async (taskId: string): Promise<any> => {
  const comments = await Comment.find({ task: taskId }).populate('user').populate('task');

  return comments;
};

const updateComment = async (id: string, text: string): Promise<any> => {
  const comment = await Comment.findByIdAndUpdate(id, { text }, { new: true });

  return comment;
};

const deleteComment = async (id: string): Promise<boolean> => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
      return false;
    }

    // remove comment from user's comments
    await User.findByIdAndUpdate(deletedComment.user, { $pull: { comments: id } });

    // remove comment from task's comments
    await Task.findByIdAndUpdate(deletedComment.task, { $pull: { comments: id } });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export { createComment, getCommentById, getCommentsByTaskId, updateComment, deleteComment };
