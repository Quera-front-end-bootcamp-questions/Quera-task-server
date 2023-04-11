import express, { Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import dbConnect from "../Db/DbConnection"; // import the dbConnect function

import userRouter from '../Routes/User/User.Route';

require("dotenv").config();

const App = express();

App.use(morgan("dev"));
App.use(helmet());
App.use(cors());
App.use(express.json());

// call the dbConnect function
dbConnect();

App.use('/api/user', userRouter);


App.get("/", async (req: Request, res: Response) => {
  res.send("Download postman file");
});

export default App;
