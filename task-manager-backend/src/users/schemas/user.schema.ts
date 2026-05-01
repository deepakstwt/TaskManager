import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.MEMBER })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: String, default: 'Team Task Workspace' })
  projectName: string;

  @Prop({ type: Types.ObjectId, required: true })
  projectId: Types.ObjectId;

  @Prop({ type: String, required: true, index: true })
  inviteCode: string;
  
  // createdAt is automatically managed by timestamps: true, but we type it
  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
