import {Model, model, Schema } from 'mongoose';
import { IUser } from '../interfaces/user-interface';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

// ISSUE: Own every parameter and any missing dependencies
const UserSchema = new Schema({
  id: {
    type: Schema.Types.String,
  },
  email    : {
    type     : Schema.Types.String,
    lowercase: true,
    unique   : true,
    index    : true
  },
  password     : {
    type: Schema.Types.String,
    required : [true, "can't be blank"],
  }
}, {timestamps: true});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  let count =await this.collection.countDocuments();
  this.id = count+1;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword:string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User: Model<IUser> = model<IUser>('User', UserSchema);