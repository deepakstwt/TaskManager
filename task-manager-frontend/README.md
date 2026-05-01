# TaskManagerOS: Project Management Dashboard Frontend

[![Next.js](https://img.shields.io/badge/Framework-Next.js%2015-black)](#)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-blue)](#)
[![Recharts](https://img.shields.io/badge/UI-Recharts-orange)](#)

A modern, responsive project management dashboard built for high-level data visualization and team coordination. This application interfaces with the TaskManagerOS Backend to provide real-time updates and seamless task tracking.

---

## ✨ Features

- **Dynamic Visualization**: Interactive charts for task completion rates, priority breakdowns, and productivity trends.
- **Task Board**: Unified task board view with filtering, searching, and pagination.
- **Secure Sessions**: Persistent JWT-based authentication with role-based access.
- **Data Portability**: Export any filtered view of your task data to a CSV file.
- **Premium Aesthetics**: Minimalist "Clinical" design language with dark mode support.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Backend running at `http://localhost:3000`

### 2. Installation
1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd task-manager-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 🏗 Key Structure
```text
task-manager-frontend/
├── app/               # Next.js App Router (Dashboard, Board, Auth)
├── components/        # UI components (Task Table, Charts, Modals)
├── lib/               # API client (Axios) and utility functions
└── public/            # Static assets and icons
```

---

## 👥 Project Onboarding & RBAC

TaskManagerOS utilizes a secure, project-centric onboarding flow governed by Role-Based Access Control (RBAC).

### **1. The Lifecycle**
1. **Project Creation**: An Admin registers *without* an invite code. The system automatically creates a new `projectId` and a unique `inviteCode` for their workspace.
2. **Team Invitation**: The Admin generates role-specific invite links (Member or Observer) and shares them with their team.
3. **User Onboarding**: New users register via the invite link. The system validates the code, inherits the `projectId`, and assigns the pre-defined role.

### **2. Role Definitions**
- **Admin**: Full control over tasks (CRUD), project settings, and team management.
- **Member**: Access to view tasks and update their status (Execution level).

---

## 🛠 Tech Decisions & Tradeoffs

- **Next.js App Router**: Chosen for its built-in optimizations for routing and performance.
- **Recharts for Data Viz**: Selected for its balance between flexibility and responsiveness.
- **Tailwind CSS**: Enables rapid iteration on the premium aesthetic without technical bloat.
