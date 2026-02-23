# Task Management System

A modern full-stack Task Management System built with React, TypeScript, Express, and Supabase. This application enables administrators to manage employees and assign tasks, while employees can view and update their assigned work through a clean and intuitive dashboard.

## Live Demo

Frontend (Vercel): [https://taskmanagement-sage-one.vercel.app](https://taskmanagement-two-psi.vercel.app/)

---

## Features

### Authentication

* Secure login system
* JWT-based authentication
* Role-based access control (Admin / Employee)

### Admin Features

* Create, edit, and delete tasks
* Assign tasks to employees
* Manage employee accounts
* View task progress and status
* Dashboard overview

### Employee Features

* View assigned tasks
* Update task status
* Track deadlines
* Personal dashboard

### UI/UX

* Modern glassmorphism design
* Responsive layout
* Collapsible sidebar
* Interactive dashboard
* Notifications system

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Axios
* Lucide Icons

### Backend

* Node.js
* Express
* TypeScript
* Supabase
* JWT Authentication

### Database

* Supabase (PostgreSQL)

### Deployment

* Frontend: Vercel
* Backend: Render

---

## Project Structure

```
taskmanagement/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── types/
│   ├── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.ts
│   ├── package.json
│
└── README.md
```

---

## Installation and Setup

### Clone the repository

```
git clone https://github.com/yourusername/taskmanagement.git
cd taskmanagement
```

---

### Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_secret
```

Run backend:

```
npm run dev
```

---

### Frontend Setup

```
cd frontend
npm install
```

Create `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```
npm run dev
```

---

## API Endpoints

### Auth

```
POST /api/auth/login
```

### Tasks

```
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
PATCH  /api/tasks/:id/status
DELETE /api/tasks/:id
```

### Employees

```
GET    /api/employees
POST   /api/employees
PUT    /api/employees/:id
DELETE /api/employees/:id
```

---

## Deployment

### Frontend (Vercel)

* Set root directory: frontend
* Add environment variable:

```
VITE_API_URL=
```

### Backend (Render)

* Set build command:

```
npm install && npm run build
```

* Start command:

```
npm start
```

---

## Screenshots

* Admin Dashboard
* Employee Dashboard
* Task Board
* Login Page

<img width="1910" height="905" alt="image" src="https://github.com/user-attachments/assets/7af456f5-aec6-4add-85b8-83f224478cf4" />
<img width="1893" height="894" alt="image" src="https://github.com/user-attachments/assets/244414f6-44f1-46cb-ba4e-b0264f88f4a4" />
<img width="1847" height="863" alt="image" src="https://github.com/user-attachments/assets/bd68ff53-4eea-4388-9d49-d4453784b4f9" />
<img width="1858" height="868" alt="image" src="https://github.com/user-attachments/assets/ff6f897e-a9ef-46ff-b14d-ebdf3628fed6" />
<img width="1898" height="901" alt="image" src="https://github.com/user-attachments/assets/9b6b5074-74dd-45cf-a706-a14d8bb4e99e" />






---

## Future Improvements

* Email notifications
* Task comments
* File attachments
* Real-time updates
* Analytics dashboard

---

## Author

Sai Viraj

GitHub: https://github.com/SimplyViraj

---

## License

This project is licensed under the MIT License.
