import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument, TaskStatus } from '../task/schemas/task.schema';
import { QueryDashboardDto } from './dto/query-dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>
  ) {}

  async getSummary(projectId: string, query: QueryDashboardDto, userId: string, role: string) {
    const data = await this.getDashboardData(projectId, query, userId, role);
    return data.summary;
  }

  async getPriorityBreakdown(projectId: string, query: QueryDashboardDto, userId: string, role: string) {
    const data = await this.getDashboardData(projectId, query, userId, role);
    return data.priorities;
  }

  async getMonthlyTrends(projectId: string, query: QueryDashboardDto, userId: string, role: string) {
    const data = await this.getDashboardData(projectId, query, userId, role);
    return data.trends;
  }

  private calculateProgress(completed: number, pending: number): number {
    const total = completed + pending;
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }

  async getDashboardData(projectId: string, query: QueryDashboardDto, userId: string, role: string) {
    const { startDate, endDate, range = '6M' } = query;
    const matchStage: any = { 
      isDeleted: { $ne: true },
      projectId: new Types.ObjectId(projectId)
    };

    // Personalized statistics: Members only see data for tasks assigned to them
    if (role.toLowerCase() !== 'admin') {
      matchStage.assignedTo = new Types.ObjectId(userId);
    }

    if (startDate || endDate) {
      const dateFilter: { $gte?: Date; $lte?: Date } = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
      matchStage.date = dateFilter;
    }

    const result = await this.taskModel.aggregate([
      { $match: matchStage },
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                totalCompleted: { $sum: { $cond: [{ $eq: ["$status", TaskStatus.DONE] }, "$weight", 0] } },
                totalPending: { $sum: { $cond: [{ $ne: ["$status", TaskStatus.DONE] }, "$weight", 0] } }
              }
            }
          ],
          priorities: [
            {
              $group: {
                _id: "$priority",
                total: { $sum: "$weight" }
              }
            },
            {
              $project: {
                _id: 0,
                priority: "$_id",
                total: 1
              }
            },
            { $sort: { total: -1 } }
          ],
          trends: [
            {
              $group: {
                _id: {
                  year: { $year: "$date" },
                  month: { $month: "$date" }
                },
                completed: { $sum: { $cond: [{ $eq: ["$status", TaskStatus.DONE] }, "$weight", 0] } },
                pending: { $sum: { $cond: [{ $ne: ["$status", TaskStatus.DONE] }, "$weight", 0] } }
              }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
          ]
        }
      }
    ]);

    const facetData = result[0];
    
    // Processing Summary
    const summaryRaw = facetData.summary[0] || { totalCompleted: 0, totalPending: 0 };
    const totalCompleted = Number(summaryRaw.totalCompleted || 0);
    const totalPending = Number(summaryRaw.totalPending || 0);
    
    const summary = {
      totalCompleted,
      totalPending,
      overallProgress: this.calculateProgress(totalCompleted, totalPending)
    };

    // Processing Priorities
    const priorities = facetData.priorities || [];

    // Processing Trends
    const dataMap = new Map<string, { completed: number; pending: number }>();
    (facetData.trends || []).forEach((item: any) => {
      const monthStr = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
      dataMap.set(monthStr, { completed: item.completed, pending: item.pending });
    });

    const monthsToShow = range === '1M' ? 1 : range === '3M' ? 3 : 6;
    const trends = [];
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      
      const entry = dataMap.get(monthStr) || { completed: 0, pending: 0 };
      trends.push({
        month: monthStr,
        completed: entry.completed,
        pending: entry.pending
      });
    }

    return {
      summary,
      priorities,
      trends
    };
  }
}
