import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument, TaskStatus } from './schemas/task.schema';
import { CreateTaskDto, UpdateTaskDto, QueryTaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>
  ) {}

  async createTask(userId: string, projectId: string, dto: CreateTaskDto): Promise<Task> {
    const task = new this.taskModel({
      ...dto,
      userId: new Types.ObjectId(userId),
      projectId: new Types.ObjectId(projectId),
      assignedTo: dto.assignedTo ? new Types.ObjectId(dto.assignedTo) : undefined,
    });
    return task.save();
  }

  async getTasks(projectId: string, query: QueryTaskDto, userId: string, role: string) {
    const { status, priority, startDate, endDate, page = 1, limit = 10 } = query;
    const filter: any = { projectId: new Types.ObjectId(projectId), isDeleted: { $ne: true } };

    // Personalized visibility: Members only see tasks assigned to them
    if (role.toLowerCase() !== 'admin') {
      filter.assignedTo = new Types.ObjectId(userId);
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const total = await this.taskModel.countDocuments(filter);
    const data = await this.taskModel.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('assignedTo', 'name email')
      .exec();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async getTasksCsv(projectId: string, query: QueryTaskDto, userId: string, role: string): Promise<string> {
    const { data } = await this.getTasks(projectId, { ...query, limit: 1000 }, userId, role);
    const headers = 'Date,Priority,Status,Weight,Notes\n';
    const rows = data.map(t => {
      const statusLabel = t.status === TaskStatus.DONE ? 'Completed' : 'Pending';
      return `${t.date.toISOString()},${t.priority},${statusLabel},${t.weight},"${t.notes || ''}"`;
    }).join('\n');
    return headers + rows;
  }

  async updateTask(id: string, dto: UpdateTaskDto, projectId: string, userId: string): Promise<Task> {
    const updateData: any = { ...dto };
    if (dto.assignedTo) {
      updateData.assignedTo = new Types.ObjectId(dto.assignedTo);
    }

    const task = await this.taskModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), projectId: new Types.ObjectId(projectId) },
      { ...updateData },
      { new: true }
    );
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async deleteTask(id: string, projectId: string, userId: string): Promise<void> {
    const result = await this.taskModel.updateOne(
      { _id: new Types.ObjectId(id), projectId: new Types.ObjectId(projectId) },
      { isDeleted: true }
    );
    if (result.matchedCount === 0) throw new NotFoundException('Task not found');
  }
}
