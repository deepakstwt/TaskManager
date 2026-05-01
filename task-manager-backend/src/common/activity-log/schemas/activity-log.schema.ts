import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../../users/schemas/user.schema';
import { Task } from '../../../modules/task/schemas/task.schema';

export type ActivityLogDocument = ActivityLog & Document;

export enum ActivityAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class ActivityLog {
  @Prop({ required: true, enum: ActivityAction })
  action: ActivityAction;

  @Prop({ type: Types.ObjectId, ref: 'Task', required: true })
  taskId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  performedBy: Types.ObjectId;

  @Prop({ type: Object })
  details?: Record<string, any>;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);

// Index for fast retrieval by task or user
ActivityLogSchema.index({ taskId: 1 });
ActivityLogSchema.index({ performedBy: 1 });
ActivityLogSchema.index({ createdAt: -1 });
