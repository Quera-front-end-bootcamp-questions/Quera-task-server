import { Tag } from "../../Models/Tag/Tag";
import { Task } from "../../Models/Task/Task";

const createTag = async (name: string, taskId: string): Promise<any> => {
  const tag = await Tag.create({
    name,
    task: taskId,
  });

  return tag;
};

const getTagById = async (id: string): Promise<any> => {
  const tag = await Tag.findById(id);

  return tag;
};

const getTagsByTaskId = async (taskId: string): Promise<any> => {
  const tags = await Tag.find({ task: taskId });

  return tags;
};
const updateTag = async (id: string, name: string): Promise<any> => {
  const tag = await Tag.findByIdAndUpdate(id, { name }, { new: true });

  return tag;
};
const deleteTag = async (id: string): Promise<boolean> => {
  try {
    const deletedTag = await Tag.findByIdAndDelete(id);
    if (!deletedTag) {
      return false;
    }

    // remove tag from all tasks
    await Task.updateMany({ tags: id }, { $pull: { tags: id } });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export { createTag, getTagById, getTagsByTaskId, updateTag, deleteTag };
