import * as mongoose from 'mongoose';

interface IUserInterface extends mongoose.Document {
  userName: string;
  email: string;
  password: string;
  refreshToken: string;
  lastLogin: Date;
  createDate: Date;
  isAdmin: boolean;
  isActive: boolean;
  isDeleted: boolean;
  token:string;
  resetPassToken:string
}
export default IUserInterface;
