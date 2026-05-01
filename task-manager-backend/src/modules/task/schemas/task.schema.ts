import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../../users/schemas/user.schema';

export type TaskDocument = Task & Document;

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_DEV = 'in_dev',
  IN_REVIEW = 'in_review',
  DEPLOYED = 'deployed',
  DONE = 'done',
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, required: true })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  assignedTo: Types.ObjectId | User;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: Number })
  weight: number;

  @Prop({ required: true, enum: TaskStatus })
  status: TaskStatus;

  @Prop({ required: true })
  priority: string;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ type: String })
  notes?: string;

  @Prop({ default: false })
  isDeleted: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

// Indexing Performance for Dashboard Aggregations and Activity Log Queries
TaskSchema.index({ isDeleted: 1, date: -1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ isDeleted: 1, status: 1, date: -1 });
TaskSchema.index({ projectId: 1, isDeleted: 1 });
