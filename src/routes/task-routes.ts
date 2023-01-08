import { NextFunction, Request, Response, Router } from 'express';
import {protect } from "../middleware/auth";
import {Task} from "../models/task.model";
import { asyncHandler } from '../middleware/async';

const router: Router = Router();

/**
 * GET /api/Task
 */
router.get('/list-tasks',protect,  asyncHandler(async(req: Request | any, res: Response) => {

    const tasks = await Task.find({},{_id:0}).lean();
    res.status(200).json({
     tasks: tasks
    });

  }
));


/**
 * POST /api/Tasks
 */
router.post('/create-task',protect, asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const {name} = req.body;
    let task = await Task.findOne({name: name});
    if(task) {
      return res.status(400).json({message:"task with this name already exists!"})
    }
    if(!name ) {
      return res.status(400).json({message:"name is required field"});
    }

   task = await Task.create({
    name
  });
  task = task.toObject();
 delete task._id;
res.status(201).json({task});
  

}));


export const TasksRoutes: Router = router;