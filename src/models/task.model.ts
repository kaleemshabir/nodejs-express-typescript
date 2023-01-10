import {Model, model, Schema } from 'mongoose';
import { ITask } from '../interfaces/task.interface';

// ISSUE: Own every parameter and any missing dependencies
const TaskSchema = new Schema({
  id: {
    type: Schema.Types.String,
  },
  name    : {
    type     : Schema.Types.String,
    unique   : true,
    index    : true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, {timestamps: true});

TaskSchema.pre('save', async function () {
  let count =await this.collection.countDocuments();
  this.id = count+1;
});

export const Task: Model<ITask> = model<ITask>('Task', TaskSchema);
