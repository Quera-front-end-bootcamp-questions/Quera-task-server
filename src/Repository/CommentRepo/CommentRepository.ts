import { Comment } from '../../Models/Comment/Comment';
import { Task } from '../../Models/Task/Task';
import { User } from '../../Models/User/User';

const getCommentById = async (id: string): Promise<any> => {
  const comment = await Comment.findById(id).select('-__v').populate({
    path: 'user',
    model: 'User',
    select: 'username _id',
  });

  return comment;
};

const getCommentsByTaskId = async (taskId: string): Promise<any> => {
  const comments = await Comment.find({ task: taskId })
    .select('-__v -task')
    .populate({
      path: 'user',
      model: 'User',
      select: 'username _id',
    });

  return comments;
};

const updateComment = async (id: string, text: string): Promise<any> => {
  const comment = await Comment.findByIdAndUpdate(id, { text }, { new: true })
    .select('-__v -task')
    .populate({
      path: 'user',
      model: 'User',
      select: 'username _id',
    });

  return comment;
};

const deleteComment = async (id: string): Promise<boolean> => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
      return false;
    }

    // remove comment from user's comments
    await User.findByIdAndUpdate(deletedComment.user, {
      $pull: { comments: id },
    });

    // remove comment from task's comments
    await Task.findByIdAndUpdate(deletedComment.task, {
      $pull: { comments: id },
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export { getCommentById, getCommentsByTaskId, updateComment, deleteComment };
