import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';
import { TaskStatus } from '../schemas/task.schema';

export class CreateTaskDto {
  @ApiProperty({ description: 'A short descriptive title for the task', example: 'Refactor Auth Logic' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'The relative effort or weight of the task', example: 5 })
  @IsNumber()
  weight: number;

  @ApiProperty({ enum: TaskStatus, description: 'The current status of the task' })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiPropertyOptional({ description: 'The user ID this task is assigned to' })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiProperty({ description: 'The priority or classification level', example: 'High' })
  @IsString()
  priority: string;

  @ApiProperty({ description: 'Target or completion date', example: '2023-10-27T00:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ description: 'Detailed objective or description' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Update documentation' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 8 })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ description: 'The user ID this task is assigned to' })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({ example: 'Medium' })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class QueryTaskDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  export?: string;

  @IsOptional()
  @IsString()
  _cb?: string;
}
