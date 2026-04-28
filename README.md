# Smart CGPA & SGPA Analyzer

A full-stack MERN application to track academic performance, calculate SGPA/CGPA, visualize trends, and predict goal achievement.

---

## Tech Stack
- **Frontend**: React.js + Tailwind CSS + Recharts
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcrypt

---

## Project Structure

```
smart-cgpa-analyzer/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/cgpaCalculator.js
│   ├── .env.example
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── context/AuthContext.jsx
    │   ├── hooks/useAuth.js
    │   ├── components/
    │   └── pages/
    └── package.json
```

---

## Setup Instructions

### Prerequisites
- Node.js v16+
- MongoDB (local or MongoDB Atlas)
- npm

---

### 1. Clone / Extract the project

```bash
cd smart-cgpa-analyzer
```

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
```

Edit `.env` and set your values:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart_cgpa_db
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

Backend runs on: http://localhost:5000
Health check: http://localhost:5000/api/health

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the frontend
npm start
```

Frontend runs on: http://localhost:3000

---

## API Endpoints

| Method | Endpoint                          | Description                  |
|--------|-----------------------------------|------------------------------|
| POST   | /api/auth/register                | Register new user            |
| POST   | /api/auth/login                   | Login                        |
| GET    | /api/auth/me                      | Get current user             |
| PUT    | /api/auth/target                  | Update target CGPA           |
| GET    | /api/semesters                    | Get all semesters            |
| POST   | /api/semesters                    | Create semester              |
| GET    | /api/semesters/:id                | Get semester + subjects      |
| PUT    | /api/semesters/:id                | Update semester              |
| DELETE | /api/semesters/:id                | Delete semester              |
| GET    | /api/subjects/:semesterId         | Get subjects                 |
| POST   | /api/subjects/:semesterId         | Add subject                  |
| PUT    | /api/subjects/:id                 | Update subject               |
| DELETE | /api/subjects/:id                 | Delete subject               |
| GET    | /api/analytics/dashboard          | Dashboard data               |
| GET    | /api/analytics/subjects           | Subject analytics            |
| GET    | /api/analytics/goal               | Goal prediction              |
| GET    | /api/analytics/suggestions        | Smart suggestions            |

---

## Grade Scale (10-point)

| Grade | Points |
|-------|--------|
| O     | 10     |
| A+    | 9      |
| A     | 8      |
| B+    | 7      |
| B     | 6      |
| C     | 5      |
| F     | 0      |

---

## Features
- JWT Authentication
- Semester & Subject CRUD
- Auto SGPA recalculation on every change
- CGPA calculated from all semesters
- SGPA trend line chart
- Grade distribution donut chart
- Goal predictor (required SGPA calculator)
- Smart suggestions engine
- PDF export of analytics
- Responsive UI
