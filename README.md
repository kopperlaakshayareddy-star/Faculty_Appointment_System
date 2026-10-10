# Faculty Appointment Booking System (MERN Stack)

A full-stack faculty appointment booking system built with **MongoDB, Express.js, React.js, and Node.js**.

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React.js (Vite), Tailwind CSS     |
| Backend     | Node.js, Express.js               |
| Database    | MongoDB (Mongoose ODM)            |
| Auth        | JWT (JSON Web Tokens)             |
| Validation  | express-validator                 |
| HTTP Client | Axios                             |
| Notifications| react-hot-toast                  |

## Features

### Student
- Register / Login
- Browse faculty list (search + department filter)
- View available time slots
- Book appointments (faculty, date, time, purpose)
- View appointment history with status tracking
- Edit or cancel pending/approved appointments

### Faculty
- Login
- Create and manage available time slots
- View appointment requests
- Approve, Reject, or Reschedule appointments
- Dashboard showing today's appointments and stats

### Admin
- Manage students (view, search, delete)
- Manage faculty (view, search by department, delete)
- View all appointments with search and date/status filters
- Dashboard with appointment statistics and status breakdown

### UI Features
- Modern responsive design
- Dark mode toggle (persisted in localStorage)
- Sidebar navigation + top navbar
- Toast notifications
- Loading spinners
- Modal dialogs
- Date pickers and time selectors
- Role-based routing and access control

## Project Structure

```
project/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── index.js           # Environment config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── appointmentController.js
│   │   ├── slotController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT protect + role authorize
│   │   ├── error.js           # Error handler + notFound
│   │   └── validation.js      # express-validator handler
│   ├── models/
│   │   ├── User.js            # Student, Faculty, Admin models
│   │   ├── Slot.js
│   │   └── Appointment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── slotRoutes.js
│   │   └── appointmentRoutes.js
│   ├── utils/
│   │   └── seed.js            # Database seeder
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AppointmentCard.jsx
    │   │   ├── DashboardLayout.jsx
    │   │   ├── Modal.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── Spinner.jsx
    │   │   ├── StatCard.jsx
    │   │   ├── StatusBadge.jsx
    │   │   └── ThemeToggle.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   ├── ThemeContext.jsx
    │   │   └── themeUtils.js
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── NotFound.jsx
    │   │   ├── student/
    │   │   │   ├── StudentDashboard.jsx
    │   │   │   ├── FacultyList.jsx
    │   │   │   ├── BookAppointment.jsx
    │   │   │   └── StudentAppointments.jsx
    │   │   ├── faculty/
    │   │   │   ├── FacultyDashboard.jsx
    │   │   │   ├── ManageSlots.jsx
    │   │   │   └── FacultyAppointments.jsx
    │   │   └── admin/
    │   │       ├── AdminDashboard.jsx
    │   │       ├── ManageStudents.jsx
    │   │       ├── ManageFaculty.jsx
    │   │       └── AllAppointments.jsx
    │   ├── services/
    │   │   └── api.js          # Axios instance with interceptors
    │   ├── App.jsx             # Router
    │   ├── main.jsx            # Entry point
    │   └── index.css           # Tailwind + custom styles
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    └── package.json
```

## Prerequisites

- **Node.js** v18 or higher
- **MongoDB** running locally (or a MongoDB Atlas connection string)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repo-url>
cd project
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` if your MongoDB URI or port differs:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/faculty_booking
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Seed the database (optional but recommended)

This creates demo users and sample data:

```bash
npm run seed
```

**Demo accounts:**

| Role    | Email                          | Password     |
|---------|--------------------------------|--------------|
| Admin   | admin@university.edu           | admin123     |
| Faculty | sarah.chen@university.edu      | faculty123   |
| Student | john.smith@university.edu      | student123   |

### 4. Frontend setup

```bash
cd frontend
npm install
```

Start the dev server:

```bash
npm run dev
```

The app runs at `http://localhost:5173`. The Vite dev server proxies `/api` requests to the backend at `localhost:5000`.

## API Endpoints

### Auth
| Method | Endpoint           | Access  | Description         |
|--------|--------------------|---------|---------------------|
| POST   | `/api/auth/register` | Public  | Register (student/faculty) |
| POST   | `/api/auth/login`    | Public  | Login (all roles)  |
| GET    | `/api/auth/me`       | Auth    | Get current user   |
| PUT    | `/api/auth/profile`  | Auth    | Update profile     |

### Users
| Method | Endpoint              | Access         | Description          |
|--------|-----------------------|----------------|----------------------|
| GET    | `/api/users/faculty`  | Auth           | List faculty         |
| GET    | `/api/users/faculty/:id` | Auth        | Get single faculty   |
| GET    | `/api/users/departments` | Auth        | List departments     |
| GET    | `/api/users/students` | Admin          | List students        |
| DELETE | `/api/users/students/:id` | Admin      | Delete student       |
| DELETE | `/api/users/faculty/:id` | Admin       | Delete faculty       |

### Slots
| Method | Endpoint                | Access   | Description            |
|--------|-------------------------|----------|------------------------|
| POST   | `/api/slots`            | Faculty  | Create slot            |
| GET    | `/api/slots/my`         | Faculty  | List own slots         |
| DELETE | `/api/slots/:id`        | Faculty  | Delete slot            |
| GET    | `/api/slots/faculty/:id` | Auth    | Available slots for faculty |

### Appointments
| Method | Endpoint                        | Access   | Description              |
|--------|---------------------------------|----------|--------------------------|
| POST   | `/api/appointments`             | Student  | Book appointment         |
| GET    | `/api/appointments/my`          | Student  | Own appointments         |
| PUT    | `/api/appointments/my/:id`      | Student  | Edit appointment         |
| PATCH  | `/api/appointments/my/:id/cancel` | Student | Cancel appointment     |
| GET    | `/api/appointments/faculty`     | Faculty  | Faculty appointments     |
| PATCH  | `/api/appointments/:id/status`  | Faculty  | Approve/Reject/Reschedule|
| GET    | `/api/appointments`             | Admin    | All appointments         |
| GET    | `/api/appointments/stats/admin`    | Admin   | Admin dashboard stats |
| GET    | `/api/appointments/stats/faculty` | Faculty | Faculty dashboard stats|
| GET    | `/api/appointments/stats/student` | Student | Student dashboard stats|

## License

This project is for educational purposes.
