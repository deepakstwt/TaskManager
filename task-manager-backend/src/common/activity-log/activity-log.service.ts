import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityLog, ActivityLogDocument, ActivityAction } from './schemas/activity-log.schema';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectModel(ActivityLog.name) private readonly activityLogModel: Model<ActivityLogDocument>
  ) {}

  async log(action: ActivityAction, taskId: any, userId: any, details?: any) {
    const log = new this.activityLogModel({
      action,
      taskId,
      performedBy: userId,
      details,
    });
    return log.save();
  }

  async getLogs(limit = 50) {
    return this.activityLogModel
      .find()
      .populate('performedBy', 'name email role')
      .populate('taskId', 'weight status priority')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}
