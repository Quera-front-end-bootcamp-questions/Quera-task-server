import User from "../../Models/User/User";

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
  return User.findOne({ username }).select("-password_hash");
};
const getUserById = async (id: number): Promise<any | null> => {
  try {
    const user = await User.findById(id).select("-password");
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { getUserByEmail, getUserById, getUserByUsername };
