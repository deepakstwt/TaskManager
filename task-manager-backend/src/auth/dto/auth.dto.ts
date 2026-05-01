import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    description: 'The unique code provided by an administrator to join an existing project.',
    example: 'TASK-MANAGER-XP', 
    required: false 
  })
  @IsString()
  @IsOptional()
  inviteCode?: string;

  @ApiProperty({ 
    description: 'The role to join as (Member or Observer). Note: ADMIN role cannot be assigned via invite link.',
    example: 'member', 
    required: false 
  })
  @IsString()
  @IsOptional()
  role?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
