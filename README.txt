========================================================================
TASKMANAGEROS: ENTERPRISE-GRADE TEAM TASK MANAGEMENT SYSTEM
========================================================================

A high-fidelity, professional task management dashboard designed for 
real-time tracking, advanced progress aggregations, and secure team 
collaboration. This project features a robust NestJS Backend and a 
sleek Next.js Frontend built with a clinical premium aesthetic.

------------------------------------------------------------------------
1. QUICK START GUIDE
------------------------------------------------------------------------

A. BACKEND SETUP
1. Navigate to the backend directory:
   cd task-manager-backend
   
2. Install dependencies:
   npm install
   
3. Configure environment variables in .env:
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3000
   
4. Run the development server:
   npm run start:dev

B. FRONTEND SETUP
1. Navigate to the frontend directory:
   cd task-manager-frontend
   
2. Install dependencies:
   npm install
   
3. Run the development server:
   npm run dev
   
4. Access the application at http://localhost:3001

------------------------------------------------------------------------
2. TECH STACK
------------------------------------------------------------------------

BACKEND (NestJS)
- Framework: NestJS (Node.js) for a modular architecture.
- Database: MongoDB with Mongoose ODM for flexible task records.
- Security: JWT-based authentication with RBAC (Role-Based Access Control).
- Documentation: Automated Swagger/OpenAPI documentation.

FRONTEND (Next.js)
- Framework: Next.js 15+ (App Router).
- Styling: Tailwind CSS for a minimalist, premium aesthetic.
- Visuals: Recharts for dynamic task progress and productivity trends.

------------------------------------------------------------------------
3. API OVERVIEW
------------------------------------------------------------------------

The backend exposes a RESTful API with the following core modules:

- AUTH: /auth/login, /auth/register (Session management)
- TASKS: /tasks (CRUD operations, CSV export)
- DASHBOARD: /dashboard/all (Metrics, progress analytics, and trends)

------------------------------------------------------------------------
4. ROLES & PERMISSIONS (RBAC)
------------------------------------------------------------------------

ADMIN: Full access to create/edit tasks and manage team members.
MEMBER: Access to view and update task status (Execution level).

------------------------------------------------------------------------
5. ARCHITECTURAL FEATURES
------------------------------------------------------------------------

- PROJECT-LOCKED WORKSPACES: Data is isolated within project IDs.
- SOFT DELETION: Tasks are archived rather than deleted to maintain history.
- STATELESS SECURITY: Scalable JWT tokens for session management.

========================================================================
Developed with focus on visual excellence and technical rigor.
========================================================================
