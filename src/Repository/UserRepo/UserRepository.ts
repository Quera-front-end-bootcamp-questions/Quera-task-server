import User from "../../Models/User/User";
const createUser = async (userData: any) => {
  return await User.create(userData);
};

const getUserById = async (id: number) => {
  return User.findOne({ id }).populate([
    { path: "workspaces" },
    { path: "workspaceMember" },
    { path: "taskAssignees" },
    { path: "comments" },
    { path: "settings" },
    { path: "projectMember" },
  ]);
};

const getAllUsers = async () => {
  return User.find();
};

const updateUser = async (id: number, userData: any) => {
  return User.updateOne({ id }, userData);
};

const deleteUser = async (id: number) => {
  return User.deleteOne({ id });
};



const getUserByEmail = async (email: string): Promise<any | null> => {
  try {
    const user = await User.findOne({ email: email }).exec();
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getUserByUsername = async (username: string) => {
  return User.findOne({ username });
};

export {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserByEmail,
  getUserByUsername,
};
