import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards, Res } from '@nestjs/common';
import * as Express from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto, QueryTaskDto } from './dto/task.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/schemas/user.schema';
import type { AuthenticatedUser } from '../../auth/interfaces/user.interface';

@ApiTags('Task Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Create a new task (Admin and Member Only)' })
  @ApiResponse({ status: 201, description: 'Task successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires Admin or Member role' })
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async createTask(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateTaskDto) {
    return this.taskService.createTask(user.userId, user.projectId, dto);
  }

  @ApiOperation({ summary: 'Get tasks or export to CSV (Admin/Member)' })
  @ApiQuery({ name: 'export', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Returns tasks or a CSV file' })
  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MEMBER)
  async getTasks(
    @Query() query: QueryTaskDto,
    @Query('export') exportFlag: string,
    @CurrentUser() user: AuthenticatedUser,
    @Res() res: Express.Response,
  ) {
    if (exportFlag === 'true') {
      const csv = await this.taskService.getTasksCsv(user.projectId, query, user.userId, user.role);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=task-records-${Date.now()}.csv`);
      return res.send(csv);
    }
    
    res.setHeader('X-API-Version', '3.0.0-collaborative-org');
    const result = await this.taskService.getTasks(user.projectId, query, user.userId, user.role);
    return res.json(result);
  }

  @ApiOperation({ summary: 'Update an existing task (Project Manager Only)' })
  @ApiResponse({ status: 200, description: 'Task successfully updated' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires Project Manager role' })
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MEMBER)
  async updateTask(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.taskService.updateTask(id, dto, user.projectId, user.userId);
  }

  @ApiOperation({ summary: 'Archive a task (Project Manager Only)' })
  @ApiResponse({ status: 200, description: 'Task successfully marked as archived' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires Project Manager role' })
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteTask(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.taskService.deleteTask(id, user.projectId, user.userId);
  }
}
