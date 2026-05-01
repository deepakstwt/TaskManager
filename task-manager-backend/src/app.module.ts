import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './modules/task/task.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ActivityLogModule } from './common/activity-log/activity-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/task-manager'),
    UsersModule,
    AuthModule,
    TaskModule,
    DashboardModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 60, // Increased limit for enterprise-scale task dashboard updates
    }]),
    ActivityLogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
