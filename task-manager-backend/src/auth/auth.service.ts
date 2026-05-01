import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    
    try {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        let projectId: Types.ObjectId;
        let inviteCode: string;
        let role: UserRole;

        const providedInviteCode = registerDto.inviteCode?.trim();

        if (providedInviteCode) {
            // SECURITY: Enforcing role assignment strictly from invite context
            if (registerDto.role === UserRole.ADMIN) {
                throw new ForbiddenException('Admin role cannot be assigned via invite link.');
            }

            // Lookup the project via invite code
            const organizer = await this.usersService.findByInviteCode(providedInviteCode);

            if (!organizer) {
                throw new BadRequestException('Invalid or expired invite code.');
            }

            // Using role from project invite
            projectId = organizer.projectId;
            inviteCode = organizer.inviteCode;
            role = (registerDto.role as UserRole) || UserRole.MEMBER;
        } else {
            // COMPLIANCE: Only Project Manager can start a new workspace
            if (registerDto.role && registerDto.role !== UserRole.ADMIN) {
                throw new BadRequestException('Member roles require an Invite Code to join.');
            }

            // New Project Workspace
            projectId = new Types.ObjectId();
            inviteCode = `TASK-WORKSPACE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            role = UserRole.ADMIN; 
        }

        const newUser = await this.usersService.create({
            name: registerDto.name,
            email: registerDto.email,
            password: hashedPassword,
            role: role as UserRole,
            projectId,
            inviteCode,
        });

        return { 
          message: 'User registered successfully', 
          userId: newUser._id,
          inviteCode: newUser.inviteCode,
          projectId: newUser.projectId
        };
    } catch (error: any) {
        if (error instanceof BadRequestException || error instanceof ForbiddenException) throw error;
        if (error.name === 'ValidationError' || error.code === 11000) {
            throw new BadRequestException(error.message || 'Validation failed');
        }
        throw new InternalServerErrorException('Error registering user');
    }
  }

  /**
   * Validates and standardizes role values to ensure system consistency.
   * Directs all input roles to their corresponding system-defined UserRole.
   */
  private normalizeRole(role: string): UserRole {
    switch (role?.toLowerCase()) {
      case 'project_manager':
      case 'admin':
        return UserRole.ADMIN;
      case 'team_member':
      case 'observer':
      case 'member':
      default:
        return UserRole.MEMBER;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Standardize role value for JWT payload consistency
    const normalizedRole = this.normalizeRole(user.role);

    const token = this.jwtService.sign({ 
      userId: user._id.toString(), 
      projectId: user.projectId.toString(),
      inviteCode: user.inviteCode,
      name: user.name,
      role: normalizedRole
    });

    return { 
      access_token: token, 
      user: { 
        id: user._id.toString(), 
        name: user.name, 
        email: user.email, 
        role: normalizedRole,
        inviteCode: user.inviteCode
      } 
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const normalizedRole = this.normalizeRole(user.role);

    return {
      userId: user._id.toString(),
      projectId: user.projectId.toString(),
      inviteCode: user.inviteCode,
      name: user.name,
      email: user.email,
      role: normalizedRole
    };
  }
}
