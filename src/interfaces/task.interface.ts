import {Document } from 'mongoose';

export interface ITask extends  Document{
  name: string;
  id: string,
  user: string
}
