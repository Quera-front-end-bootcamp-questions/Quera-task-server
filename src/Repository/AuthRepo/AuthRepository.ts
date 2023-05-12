
//create function

import { User } from "../../Models/User/User";

const createUser = async (userData: any) => {
  if (userData !== undefined && userData !== null) {
    return await User.create(userData);
  } else {
    throw new Error("userData parameter is undefined or null");
  }
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
    const user = await User.findOne({ email: email });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getUserByUsername = async (username: string) => {
  return User.findOne({ username });
};

const updatePasswordResetToken = async (userId: number, token: string) => {
  const user = await User.findOne({ _id: userId });
  if (user) {
    user.password_reset_token = token;
    await user.save();
    return user;
  } else {
    return null;
  }
};

const getUserByPasswordResetToken = async (token: string) => {
  return User.findOne({ password_reset_token: token });
};

const updatePassword = async (userId: number, newPasswordHash: string) => {
  return User.updateOne(
    { id: userId },
    { password_hash: newPasswordHash, password_reset_token: null }
  );
};

export {
  getUserByPasswordResetToken,
  updatePassword,
  updatePasswordResetToken,
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserByEmail,
  getUserByUsername,
};
