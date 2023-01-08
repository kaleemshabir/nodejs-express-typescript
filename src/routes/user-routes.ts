import { NextFunction, Request, Response, Router } from 'express';
import {protect } from "../middleware/auth";
import {User} from "../models/user.model";
import { asyncHandler } from '../middleware/async';

const router: Router = Router();

/**
 * GET /api/user
 */
router.get('/user',protect,  asyncHandler(async(req: Request | any, res: Response) => {

    const user = req.user;
    res.status(200).json({
     user: {id: user.id, email:user.email}
    });

  }
));


/**
 * POST /api/users
 */
router.post('/register', asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body;
    let user = await User.findOne({email: email});
    if(user) {
      return res.status(400).json({message:"this email taken!"})
    }
    if(!email || !password) {
      return res.status(400).json({message:"Password and email are required fields"});
    }
    if(!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({message:"Email must be valid"});
    }
    if(password.length<6) {
      return res.status(400).json({message:"Password must be at least 6 characters long!"});
    }

   user = await User.create({
    email, password
  });
  user = user.toObject();
  user._id= undefined;
res.status(201).json({user});
  

}));


// ISSUE: How does this work with the trailing (req, res, next)?
/**
 * POST /api/users/login
 */
router.post('/login',asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Validate emil & password
    if (!email || !password) {
        return res.status(400).json("Please provide an email and password");
    }
  
    // Check for user
    const user = await User.findOne({ email }).select('+password +_id');
  
    if (!user) {
        return res.status(401).json("Invalid credentials");
    }
  
    // Check if password matches
    const isMatch = await user.matchPassword(password);
  
    if (!isMatch) {
        return res.status(401).json("Invalid credentials");
    }
      // Create token
  const token = user.getSignedJwtToken();
  res.status(200).json({jwt:token});
 

}));


export const UsersRoutes: Router = router;