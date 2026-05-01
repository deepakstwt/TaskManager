import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { QueryDashboardDto } from './dto/query-dashboard.dto';
import type { AuthenticatedUser } from '../../auth/interfaces/user.interface';

@ApiTags('Task Analytics Dashboard')
@ApiBearerAuth()
@SkipThrottle()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Get quick task summary (Completed, Pending, Overall Progress)' })
  @ApiResponse({ status: 200, description: 'Returns summary metrics' })
  @Get('summary')
  async getSummary(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryDashboardDto) {
    return this.dashboardService.getSummary(user.projectId, query, user.userId, user.role);
  }
  
  @ApiOperation({ summary: 'Get aggregation of tasks by priority/type' })
  @ApiResponse({ status: 200, description: 'Returns priority breakdown' })
  @Get('categories')
  async getPriorityBreakdown(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryDashboardDto) {
    return this.dashboardService.getPriorityBreakdown(user.projectId, query, user.userId, user.role);
  }
  
  @ApiOperation({ summary: 'Get time-series trends for task completion performance' })
  @ApiResponse({ status: 200, description: 'Returns monthly task trends' })
  @Get('trends')
  async getMonthlyTrends(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryDashboardDto) {
    return this.dashboardService.getMonthlyTrends(user.projectId, query, user.userId, user.role);
  }

  @ApiOperation({ summary: 'Get unified task dashboard dataset' })
  @Get('all')
  async getDashboardData(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryDashboardDto) {
    return this.dashboardService.getDashboardData(user.projectId, query, user.userId, user.role);
  }
}
