import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument, UserRole } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByInviteCode(inviteCode: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ inviteCode: { $regex: new RegExp(`^${inviteCode}$`, 'i') } }).exec();
  }

  async create(userData: Partial<User>): Promise<UserDocument> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async findAll(projectId: string): Promise<UserDocument[]> {
    return this.userModel.find({ projectId: new Types.ObjectId(projectId) }, '-password').exec();
  }

  async updateRole(id: string, role: UserRole): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, { role }, { new: true }).exec();
  }

  async remove(id: string): Promise<any> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
