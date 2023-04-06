import express, { Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import dbConnect from "../Db/DbConnection";


const middlewares = require("../MiddleWares/MiddleWares");
const userModel = require("../Models/User");

require("dotenv").config();

const App = express();

App.use(morgan("dev"));
App.use(helmet());
App.use(cors());
App.use(express.json());
dbConnect();

App.get("/", async (req: Request, res: Response) => {
  res.send("Download postman file");
});


App.use(middlewares.notFound);
App.use(middlewares.errorHandler);

export default App;
