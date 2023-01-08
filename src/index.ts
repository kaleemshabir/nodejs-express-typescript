import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { UsersRoutes } from './routes/user-routes';
import { TasksRoutes } from './routes/task-routes';

const app: Express = express();
import {connect} from "./config/database";
// Connect database
connect();
dotenv.config();
// Body parser
app.use(express.json());
app.use('/users', UsersRoutes);
app.use('/tasks', TasksRoutes);


const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});