# TaskManagerOS: Team Task Management System Backend

[![NestJS](https://img.shields.io/badge/Framework-NestJS-red)](#)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)](#)
[![Swagger](https://img.shields.io/badge/API-Swagger-blue)](#)

A high-performance backend system for tracking team tasks and providing real-time dashboard progress analytics. This system enforces strict **Role-Based Access Control (RBAC)** to ensure data security and integrity across multiple user tiers.

---

## 🏗 System Architecture

The backend is built with a modular NestJS architecture:
- **Controller Layer**: Handles routing, request mapping, and Swagger documentation.
- **Service Layer**: Implements business logic, task handling, and progress aggregation.
- **Data Layer (Mongoose)**: Manages task schema definitions, indexing, and MongoDB connectivity.
- **Guard Layer**: Enforces JWT authentication and RBAC permissions.

---

## 🚀 Installation & Local Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or via Atlas)
- npm or yarn

### 2. Environment Configuration
Create a `.env` file in the `task-manager-backend` directory:
```env
MONGODB_URI=mongodb://localhost:27017/taskmanageros
JWT_SECRET=your_super_secret_jwt_key
PORT=3000
```

### 3. Dependencies & Seeding
```bash
# Install packages
npm install

# Seed the database with sample tasks
npm run seed
```

### 4. Running the Application
```bash
# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod
```

---

## 📡 API Reference & Modules

### 1. **Authentication (/auth)**
- `POST /auth/register`: Create a new user account or join via invite.
- `POST /auth/login`: Authenticate and receive a JWT session token.

### 2. **Task Management (/tasks)**
- `POST /tasks`: Create a new task (**Admin** only).
- `GET /tasks`: Retrieve task board with filtering, searching, and pagination.
- `GET /tasks?export=true`: Export the current task view as a CSV.
- `PATCH /tasks/:id`: Update an existing task (**Admin** or **Member** for status).
- `DELETE /tasks/:id`: Archive a task (**Admin** only).

### 3. **Dashboard Analytics (/dashboard)**
- `GET /dashboard/all`: Unified dataset for metrics, priorities, and trends.
- `GET /dashboard/summary`: Quick stats (Completed, Pending, Overall Progress).
- `GET /dashboard/categories`: Breakdown of effort/weight by task priority.
- `GET /dashboard/trends`: Time-series data for monthly performance.

---

## 📘 Interactive Documentation (Swagger)

The API is fully documented using the OpenAPI specification. Access the interactive Swagger UI to explore and test endpoints:
*For local development, visit `http://localhost:3000/api`.*

---

## 👥 Project Onboarding & RBAC

TaskManagerOS utilizes a secure, project-centric onboarding flow:

### **1. The Lifecycle**
1. **Project Creation**: An Admin registers *without* an invite code. A unique `projectId` and `inviteCode` are generated.
2. **Team Invitation**: The Admin generates invite links (Member or Observer) and shares them.
3. **User Onboarding**: New users register via link, inheriting the `projectId` and assigned role.

### Roles & Permissions
- **Admin**: Full access to create/edit tasks and manage the project.
- **Member**: Access to view and update task status.

---

## 🛠 Technical Assumptions & Tradeoffs

- **Aggregation Pipelines**: Uses complex MongoDB aggregation for high-performance dashboard metrics.
- **Soft Delete Logic**: Tasks are marked `isDeleted: true` to preserve historical activity data.
- **Stateless Auth**: JWT-based session management for scalability.
