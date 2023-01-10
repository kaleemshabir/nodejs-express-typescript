import { NextFunction, Request, Response, Router } from 'express';
import {protect } from "../middleware/auth";
import {Task} from "../models/task.model";
import { asyncHandler } from '../middleware/async';

const router: Router = Router();
export interface IGetUserAuthInfoRequest extends Request {
  user: {
    _id: string,
    id:string,
    email: string,
    
  } // or any other type
}

/**
 * GET /api/list-tasks
 */
router.get('/list-tasks',protect,  asyncHandler(async(req: Request, res: Response) => {

    const tasks = await Task.find({},{_id:0}).populate("user", "email").lean();
    res.status(200).json({
     tasks: tasks
    });

  }
));


/**
 * POST /api/create-tasks
 */
router.post('/create-task', protect,asyncHandler(async(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const {name} = req.body;
    const user = req.user._id;
  
    if(!name ) {
      return res.status(400).json({message:"name is required field"});
    }

   let task = await Task.create({
    name,user

  });
  task = task.toObject();
 delete task._id;
 task.user = req.user.email;
res.status(201).json({task});
  

}));


export const TasksRoutes: Router = router;
