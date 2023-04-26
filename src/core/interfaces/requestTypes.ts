
// import { RequestHandler } from 'express-serve-static-core';
import { Request, RequestHandler} from 'express';
import { Schema } from 'mongoose';

export interface IRequestBodyWorkspace  {
  name: string;
  members: Schema.Types.ObjectId[];
}




interface IAuthenticatedRequest extends Request {
    user: {
      id: string;
      username: string;
      email: string
      // Add any other properties that you store in the user object
    };
  }


type TAuthenticatedRequestHandler = RequestHandler<any, any,IAuthenticatedRequest>;

export default TAuthenticatedRequestHandler;