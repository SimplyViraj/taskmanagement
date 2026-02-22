# Task Management Frontend

A modern, responsive task management application built with React, TypeScript, and Tailwind CSS.

## Features

### Admin Dashboard
- **Comprehensive Task Board**: View all tasks with their current status, priority, and due dates
- **Task Management**: Create, edit, and delete tasks
- **Task Assignment**: Assign tasks to employees
- **Analytics Dashboard**:
  - Task status distribution (pie chart)
  - Tasks by priority (bar chart)
  - Employee workload overview (line chart)
  - Statistics cards (total, pending, in-progress, completed tasks)
- **Filtering**: Filter tasks by status and priority
- **Employee Management**: View and manage all employees

### Employee Dashboard
- **My Tasks**: View only tasks assigned to the employee
- **Status Updates**: Update task status (Pending → In Progress → Completed)
- **Task Overview**: Visual representation of task statuses with bar chart
- **Statistics**: View personal task statistics including overdue tasks
- **Filtering**: Filter personal tasks by status and priority

### General Features
- **Authentication**: Secure login with bearer token authentication
- **Role-Based Access Control**: Different UI for admins and employees
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Error Handling**: User-friendly error messages and notifications
- **Loading States**: Loading indicators during data fetching
- **Real-time Notifications**: Success, error, warning, and info notifications

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS v4** for styling
- **Axios** for API communication
- **Recharts** for data visualization
- **Lucide React** for icons
- **Context API** for state management

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── DashboardLayout.tsx      # Main dashboard layout with sidebar
│   │   ├── NotificationContainer.tsx # Toast notifications
│   │   ├── TaskCard.tsx             # Individual task display
│   │   └── TaskModal.tsx            # Create/edit task modal
│   ├── context/
│   │   ├── AuthContext.tsx          # Authentication state management
│   │   └── NotificationContext.tsx  # Notification management
│   ├── pages/
│   │   ├── LoginPage.tsx            # Login page
│   │   ├── AdminDashboard.tsx       # Admin dashboard with charts
│   │   ├── EmployeeDashboard.tsx    # Employee task view
│   │   └── EmployeeManagement.tsx   # Employee management (admin only)
│   ├── services/
│   │   └── api.ts                   # API client with all endpoints
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   ├── App.tsx                      # Main app component
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles
├── vite.config.ts                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS configuration
├── tsconfig.json                    # TypeScript configuration
├── .env                             # Environment variables
└── package.json                     # Dependencies
```

## Setup Instructions

### Prerequisites
- Node.js v20.19+ or v22.12+
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (already provided):
```env
VITE_API_URL=http://localhost:5000/api
```

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Usage

### Login
- Access the login page at `http://localhost:5173`
- Use credentials based on your backend setup
- Demo: `admin@example.com` / `admin123`

### For Admins
1. **Dashboard Tab**: View analytics and statistics
   - Task distribution pie chart
   - Priority breakdown bar chart
   - Employee workload line chart
   - Summary statistics

2. **Task Board Tab**: Manage all tasks
   - Click "Create New Task" to add tasks
   - Edit existing tasks by clicking the edit icon
   - Delete tasks with the delete button
   - Change task status using the dropdown
   - Filter by status and priority

3. **Employees Tab**: Manage employee roster
   - View all employees and their roles
   - Delete employees if needed

### For Employees
1. **My Tasks Tab**: View assigned tasks
   - See all tasks assigned to you
   - Update task status
   - View task priority and due dates
   - Filter tasks by status or priority

## API Integration

The frontend connects to the backend API with the following main endpoints:

### Authentication
- `POST /api/auth/login` - User login

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/status` - Update task status
- `DELETE /api/tasks/:id` - Delete task

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

## Features in Detail

### Task Management
- **Create Tasks**: Add new tasks with title, description, priority, due date, and assignee
- **Edit Tasks**: Update any task details
- **Status Tracking**: Track tasks through Pending → In Progress → Completed
- **Priority Levels**: Low, Medium, High
- **Due Dates**: Set and track task deadlines
- **Overdue Alerts**: Visual indicators for overdue tasks

### Dashboard Analytics
- **Real-time Statistics**: Task counts by status
- **Visual Charts**:
  - Pie chart for status distribution
  - Bar chart for priority breakdown
  - Line chart for employee workload
- **Responsive Charts**: Adjusts to screen size

### User Experience
- **Loading States**: Shows loading spinner while fetching data
- **Error Messages**: User-friendly error notifications
- **Success Confirmations**: Notifications on successful actions
- **Responsive Design**: Works on all device sizes
- **Collapsible Sidebar**: Toggle sidebar for more screen space
- **User Profile**: Quick access to user email and logout

## Error Handling

The application includes comprehensive error handling:
- Network errors are caught and displayed to users
- API validation errors are shown with specific messages
- Loading states prevent double-submissions
- Token expiration is handled gracefully

## Performance Optimizations

- **Code Splitting**: React components are optimized for bundling
- **Lazy Loading**: Data is fetched on demand
- **Local Storage**: Auth tokens are cached locally
- **Responsive Images**: Tailwind CSS for optimized styling
- **Minified Build**: Production build is optimized for performance
