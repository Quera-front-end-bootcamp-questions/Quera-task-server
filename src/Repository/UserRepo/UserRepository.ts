import { User } from "../../Models/User/User";

const getUserByEmail = async (email: string): Promise<any | null> => {
  try {
    const user = await User.findOne({ email: email })
      .select("-password_hash")
      .exec();
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getUserByUsername = async (username: string) => {
  return User.findOne({ username }).select("-password_hash -password_reset_token");
};
const getUserById = async (id: number): Promise<any | null> => {
  try {
    const user = await User.findById(id).select("-password_hash");
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updateUser = async (id: string, updates: any): Promise<any> => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  Object.assign(user, updates);
  await user.save();

  return user;
};

export default updateUser;

export { getUserByEmail, getUserById, getUserByUsername, updateUser };
