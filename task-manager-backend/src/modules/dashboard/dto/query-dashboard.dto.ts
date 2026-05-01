import { IsOptional, IsISO8601, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryDashboardDto {
  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @ApiPropertyOptional({ example: '6M', description: 'Range for trends (1M, 3M, 6M)' })
  @IsOptional()
  @IsString()
  range?: string;

  @IsOptional()
  _cb?: string;
}
