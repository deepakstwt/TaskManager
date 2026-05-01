# TaskManagerOS: Enterprise-Grade Team Task Management System

[![Aesthetics](https://img.shields.io/badge/Aesthetics-Premium-blueviolet)](#)
[![Stack](https://img.shields.io/badge/Stack-Next.js%20|%20NestJS%20|%20MongoDB-blue)](#)
[![Documentation](https://img.shields.io/badge/API-Swagger-green)](#api-overview)

A high-fidelity, professional task management dashboard designed for real-time tracking, advanced progress aggregations, and secure team collaboration. This project provides a robust **NestJS Backend** and a sleek **Next.js Frontend** built with a clinical premium aesthetic.

---

## 🚀 Quick Start

### 📖 Detailed Documentation
For in-depth technical details, please refer to the specific module documentation:
- 🔗 **[Backend System Documentation](./task-manager-backend/README.md)**
- 🔗 **[Frontend Application Documentation](./task-manager-frontend/README.md)**

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd task-manager-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```
4. Run the development server:
   ```bash
   npm run start:dev
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd task-manager-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the application at `http://localhost:3001`.

---

## 🛠 Tech Stack

### Backend (NestJS)
- **Framework**: NestJS (Node.js) for a modular, scalable architecture.
- **Database**: MongoDB with Mongoose ODM for flexible task records.
- **Security**: JWT-based authentication with Passport.js and Role-Based Access Control (RBAC).
- **Validation**: Strict schema validation using `class-validator`.
- **API Documentation**: Automated Swagger/OpenAPI documentation.

### Frontend (Next.js)
- **Framework**: Next.js 15+ (App Router) for high-performance rendering.
- **Styling**: Tailwind CSS for a minimalist, premium "Clinical" aesthetic.
- **Visuals**: Recharts for dynamic task progress and productivity trends.
- **State Management**: React Hooks & Axios for efficient API interaction.

---

## 📡 API Overview

The backend exposes a RESTful API with the following primary modules:

### Core Endpoints
- **Auth**: `/auth/login`, `/auth/register` (JWT-based session management).
- **Tasks**: `/tasks` (CRUD operations for tasks, CSV export).
- **Dashboard**: `/dashboard/all` (Aggregated progress metrics, priority breakdowns, and productivity trends).

---

## 👥 Project Onboarding & RBAC

TaskManagerOS utilizes a secure, project-centric onboarding flow governed by Role-Based Access Control (RBAC).

### **1. The Lifecycle**
1. **Workspace Creation**: An Admin registers *without* an invite code. The system automatically creates a new `projectId` and a unique `inviteCode` for their workspace.
2. **Team Invitation**: The Admin generates project-locked invite links and shares them with their team.
   - Example Link: `/register?code=XXXX&role=member`
3. **User Onboarding**: New users register via the invite link. The system validates the code, inherits the `projectId`, and assigns the pre-defined role.

### Roles & Permissions
- **Admin**: Full access to create/edit tasks, manage team members, and view all project analytics.
- **Member**: Access to view and update task status. Can view personalized dashboard metrics.

---

## 🧠 Architectural Assumptions & Tradeoffs

### Assumptions Made
1. **Shared Project Workspace**: Task data is managed within a project-locked workspace, ensuring privacy between different organizations.
2. **Persistence Protocol**: Tasks utilize soft-deletion (Archiving) to maintain a complete audit trail of project activity.
3. **Stateless Security**: JWT tokens ensure the system is scalable and doesn't rely on server-side session state.

---

## 📈 Future Roadmaps
- [ ] **Advanced Activity Logs**: Granular tracking of task status transitions.
- [ ] **Task Dependencies**: Visualize blockers and dependent workstreams.
- [ ] **Automated Reporting**: Weekly productivity summaries delivered via email.

---

*This project was built with a focus on visual excellence and technical rigor.*
