import { UserRole } from '../../users/schemas/user.schema';

export interface AuthenticatedUser {
  userId: string;
  projectId: string;
  role: UserRole;
  email: string;
  name: string;
}
