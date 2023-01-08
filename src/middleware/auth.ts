import { NextFunction, Request, Response, Router } from 'express';

import * as  jwt  from 'jsonwebtoken';
import  {User} from '../models/user.model';
import {asyncHandler} from "./async";
// Protect routes
export const protect = asyncHandler(async (req:Request | any, res:Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    // Set token from cookie
  }


  // Make sure token exists
  if (!token) {
    return res.status(401).json("Not authorized to access this route");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)

    req.user = await User.findById(decoded.id, {_id:0});

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json("Not authorized to access this route");
  }
});