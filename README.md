# ScheduleDB — React Frontend

A full React.js frontend for the **ScheduleDB** university scheduling system backend.

## Tech Stack
- React 18
- React Router DOM v6
- Tailwind CSS v3
- DaisyUI v4
- Vite

## Prerequisites
- Node.js 18+ installed
- The Flask backend running at `http://127.0.0.1:5000`

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

## Pages Included

### Auth
- `/login` — Login page
- `/register` — Register page

### Admin Panel (`/admin`)
- Dashboard with stats
- Users list with search & filter
- Rooms management (add & view)
- Courses list
- Generate Schedule (auto-scheduler)
- View all schedules

### Teacher Panel (`/teacher`)
- Dashboard overview
- My Courses
- Set Vacancy (mark available time slots)
- My Schedule

### Student Panel (`/student`)
- Dashboard overview
- My Schedule (filtered by department)

## Backend API
All API calls go to `http://127.0.0.1:5000/api/...`

To change the backend URL, edit:
```
src/services/api.js → BASE_URL
```

## Color Theme
Green & White — using DaisyUI custom theme `scheduleTheme`
