import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dbConnect from '../Db/DbConnection';
import projectRouter from '../Routes/Project/Project.Route';
import tagRouter from '../Routes/Tag/Tag.Route';
import userRouter from '../Routes/User/User.Route';
import authRouter from '../Routes/Auth/Auth.Route';
import workspaceRouter from '../Routes/workspace/workspace.Route';
import commentRouter from '../Routes/Comment/Comment.Route';
import boardRouter from '../Routes/Board/Board.Route';
import taskRouter from '../Routes/Task/Task.Route';
import swaggerUi from 'swagger-ui-express';
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0',
    },
  },
  apis: ["**/*.ts"]
};

const openapiSpecification = swaggerJsdoc(options);

// Serve swagger docs

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

dbConnect();
app.use('/docs', swaggerUi.serve);
app.get('/docs', swaggerUi.setup(openapiSpecification));
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

export default app;
