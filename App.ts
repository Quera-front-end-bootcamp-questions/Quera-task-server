import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dbConnect from './src/Db/DbConnection';
import projectRouter from './src/Routes/Project/Project.Route';
import tagRouter from './src/Routes/Tag/Tag.Route';
import userRouter from './src/Routes/User/User.Route';
import authRouter from './src/Routes/Auth/Auth.Route';
import workspaceRouter from './src/Routes/workspace/workspace.Route';
import commentRouter from './src/Routes/Comment/Comment.Route';
import boardRouter from './src/Routes/Board/Board.Route';
import taskRouter from './src/Routes/Task/Task.Route';
const swaggerUI = require('swagger-ui-express');
// const swaggerDocument = require('../../swagger.json');
const YAML = require('yamljs');
const swaggerJsDocs = YAML.load('./api.yaml');

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

dbConnect();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/tags', tagRouter);
app.use('/api/projects', projectRouter);
app.use('/api/workspace', workspaceRouter);
app.use('/api/comments', commentRouter);
app.use('/api/board', boardRouter);
app.use('/api/task', taskRouter);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(4000, () => console.log('Up and Running'));

export default app;
