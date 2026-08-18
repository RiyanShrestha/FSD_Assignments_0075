# StudyFlow — Your Personal Academic Workspace

A modern, production-grade full-stack student academic productivity web application designed to help learners manage courses, organize tasks and assignments, record structured notes, visualize deadlines on an interactive calendar, and track academic performance with dynamic analytics.

This project serves as a comprehensive demonstration of the concepts covered across the **IBM SkillsBuild Web Development Fundamentals** certification curriculum.

---

## Table of Contents

- [Overview & Objectives](#overview--objectives)
- [Key Features](#key-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Directory Structure](#directory-structure)
- [Database Schema & Design](#database-schema--design)
- [REST API Reference](#rest-api-reference)
- [Setup & Installation](#setup--installation)
- [Running the Application](#running-the-application)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [SDLC & Agile Development Approach](#sdlc--agile-development-approach)
- [DevOps, Containers & Cloud Deployment](#devops-containers--cloud-deployment)
- [IBM SkillsBuild Concepts Demonstrated](#ibm-skillsbuild-concepts-demonstrated)

---

## Overview & Objectives

### Problem Statement
College students frequently juggle multiple courses, assignments with overlapping deadlines, unstructured lecture notes, and scattered academic tasks. Standard generic to-do apps lack academic context such as course associations, semester tracking, syllabus progress metrics, and integrated scheduling.

### Objectives
1. **Centralized Academic Workspace**: Provide a unified interface for courses, tasks, assignments, notes, and schedules.
2. **Interactive Productivity Workflows**: Support interactive task boards with instant search, multi-field filtering, priority flags, and completion states.
3. **Actionable Analytics**: Deliver real-time visual progress indicators, course completion rates, and weekly activity charts.
4. **Production Engineering Standards**: Implement modular React architecture, secure Express REST API, robust MySQL relational schema with foreign key constraints, JWT authentication, and responsive design tokens.

---

## Key Features

### 1. Landing & Authentication
- Modern, high-conversion landing page with feature showcases and direct access to login/registration.
- Secure JWT-based authentication with bcrypt password hashing.
- Client-side and server-side input validation with instant visual feedback.

### 2. Dynamic Dashboard
- High-level metric summary cards: Total Courses, Active Tasks, Completed Tasks, and Overdue Items.
- Upcoming deadlines feed (sorted by due date with priority badges).
- Recent activity timeline and course progress visual indicators.
- Quick-action shortcuts for swift navigation.

### 3. Course Management
- Grid view of enrolled courses with instructor details, semester, and status indicators (`active`, `completed`, `dropped`).
- Add, edit, and delete courses with progress sliders.
- Detailed Course View (`/courses/:id`) with tabbed sub-views for course-specific tasks, assignments, and notes.

### 4. Interactive Task Management
- Comprehensive task tracking with states: `Pending`, `In Progress`, `Completed`, and auto-detected `Overdue`.
- Quick-toggle completion state directly from task list items.
- Live client-side search, status filter, priority filter (`High`, `Medium`, `Low`), course filter, and multi-field sorting.
- Add and edit modal with date-time pickers and course linkages.

### 5. Assignment Tracker
- Structured tracking of academic submissions with deadline classification: `Upcoming`, `Due Soon` (within 3 days), `Overdue`, and `Completed`.
- Grade tracking and priority management.

### 6. Academic Notes
- Responsive card grid for lecture and revision notes with content preview.
- Filtering by associated course and instant keyword search.
- Full-featured note editor modal.

### 7. Interactive Calendar
- Programmatically calculated monthly calendar grid (Sun–Sat) with previous/next month navigation.
- Color-coded date badges indicating tasks (blue) and assignments (purple).
- Date selection inspection panel revealing all scheduled items for that date.

### 8. Progress & Analytics
- Overall completion circular progress indicator.
- Individual course syllabus completion bars.
- 7-day weekly activity bar chart built with semantic CSS.
- Real-time productivity metrics.

### 9. Profile & Settings
- Student profile details management (Name, Program, Semester).
- Secure password change interface with confirmation matching.
- User interface preferences (Theme and Notification settings).

---

## Architecture & Tech Stack

```
[ Browser / React Client (Port 3000) ]
              │  ▲
   Fetch API  │  │  JSON Response + JWT
 (REST / HTTP)│  │
              ▼  │
[ Node.js + Express Server (Port 5000) ]
       │                   │
  Auth Middleware    Route Handlers & Validators
       │                   │
       └─────────┬─────────┘
                 │  SQL Queries (mysql2 pool)
                 ▼
     [ MySQL Database (Port 3306) ]
```

### Technology Stack
- **Frontend**: React (Create React App), React Router v6, React Icons, Custom CSS Design Tokens (Flexbox & CSS Grid).
- **Backend**: Node.js, Express.js, `express-validator`, `bcryptjs`, `jsonwebtoken`, `cors`, `morgan`, `dotenv`.
- **Database**: MySQL 8.0+ with connection pooling (`mysql2/promise`).

---

## Directory Structure

```
study_flow_app/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── EmptyState.js / .css
│   │   │   ├── LoadingSpinner.js / .css
│   │   │   └── Modal.js / .css
│   │   └── layout/
│   │       ├── Header.js / .css
│   │       ├── Layout.js / .css
│   │       └── Sidebar.js / .css
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Assignments.js / .css
│   │   ├── Calendar.js / .css
│   │   ├── CourseDetail.js / .css
│   │   ├── Courses.js / .css
│   │   ├── Dashboard.js / .css
│   │   ├── Landing.js / .css
│   │   ├── Login.js
│   │   ├── Notes.js / .css
│   │   ├── Profile.js / .css
│   │   ├── Progress.js / .css
│   │   ├── Register.js
│   │   └── Tasks.js / .css
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   ├── auth.css
│   │   ├── global.css
│   │   └── variables.css
│   ├── App.js
│   └── index.js
├── server/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validate.js
│   ├── routes/
│   │   ├── assignments.js
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── dashboard.js
│   │   ├── notes.js
│   │   ├── profile.js
│   │   └── tasks.js
│   ├── .env.example
│   ├── index.js
│   └── package.json
├── database/
│   ├── schema.sql
│   └── seed.sql
├── package.json
└── README.md
```

---

## Database Schema & Design

### Relational Entities
1. **`users`**: User identity, hashed credentials, program details, and user preferences.
2. **`courses`**: Course metadata, instructor, semester, start/end dates, progress percentage, and status.
3. **`tasks`**: Action items with title, description, priority (`low`, `medium`, `high`), status (`pending`, `in-progress`, `completed`), due date, and foreign keys (`user_id`, `course_id`).
4. **`assignments`**: Academic deliverables with deadline, grade tracking, and course linkage.
5. **`notes`**: Markdown/text study notes linked to users and courses.

### Referential Integrity & Indexes
- Foreign keys use `ON DELETE CASCADE` for user ownership and `ON DELETE SET NULL` for course disassociation.
- Key indexes created on `user_id`, `course_id`, `status`, and `due_date` across all operational tables for sub-millisecond query performance.

---

## REST API Reference

| Resource | Method | Endpoint | Description | Auth Required |
|---|---|---|---|---|
| **Auth** | `POST` | `/api/auth/register` | Register new user account | No |
| | `POST` | `/api/auth/login` | Authenticate user & return JWT token | No |
| | `GET` | `/api/auth/me` | Fetch active user session profile | Yes |
| **Courses** | `GET` | `/api/courses` | List all courses for authenticated user | Yes |
| | `POST` | `/api/courses` | Create a new course record | Yes |
| | `GET` | `/api/courses/:id` | Fetch specific course details | Yes |
| | `PUT` | `/api/courses/:id` | Update course information | Yes |
| | `DELETE` | `/api/courses/:id` | Remove course and cascade associations | Yes |
| **Tasks** | `GET` | `/api/tasks` | List tasks (supports search, sort, filter) | Yes |
| | `POST` | `/api/tasks` | Create a new task | Yes |
| | `GET` | `/api/tasks/:id` | Fetch single task | Yes |
| | `PUT` | `/api/tasks/:id` | Update task details or toggle status | Yes |
| | `DELETE` | `/api/tasks/:id` | Delete task | Yes |
| **Assignments** | `GET` | `/api/assignments` | List assignments (supports filters) | Yes |
| | `POST` | `/api/assignments` | Create assignment | Yes |
| | `GET` | `/api/assignments/:id`| Fetch assignment details | Yes |
| | `PUT` | `/api/assignments/:id`| Update assignment | Yes |
| | `DELETE` | `/api/assignments/:id`| Delete assignment | Yes |
| **Notes** | `GET` | `/api/notes` | List notes (searchable) | Yes |
| | `POST` | `/api/notes` | Create note | Yes |
| | `GET` | `/api/notes/:id` | Fetch note content | Yes |
| | `PUT` | `/api/notes/:id` | Update note | Yes |
| | `DELETE` | `/api/notes/:id` | Delete note | Yes |
| **Dashboard** | `GET` | `/api/dashboard` | Aggregated metrics & stats | Yes |
| **Profile** | `GET` | `/api/profile` | Get student profile | Yes |
| | `PUT` | `/api/profile` | Update profile info & preferences | Yes |
| | `PUT` | `/api/profile/password`| Update user password | Yes |

---

## Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ or v18+ recommended)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) (v8.0+) or XAMPP / MariaDB
- `npm` (Node Package Manager)

### Step 1: Database Setup
1. Open your MySQL client (MySQL Workbench, phpMyAdmin, or terminal CLI).
2. Execute the schema file to initialize tables:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
3. Load the demo seed dataset:
   ```bash
   mysql -u root -p < database/seed.sql
   ```

### Step 2: Backend Configuration
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify or update the `.env` file with your local MySQL credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=studyflow
   JWT_SECRET=studyflow_dev_secret_key_2024
   NODE_ENV=development
   ```

### Step 3: Frontend Configuration
1. In the project root directory:
   ```bash
   npm install
   ```
2. Check `.env` (or default fallback to `http://localhost:5000/api`).

---

## Running the Application

### Start Backend Server
```bash
cd server
npm start
# Server will listen on http://localhost:5000
```

### Start Frontend Application
```bash
# In the root directory:
npm start
# React development server will launch at http://localhost:3000
```

### Demo Login Credentials
- **Email**: `riyan@studyflow.com`
- **Password**: `password123`
*(Alternative demo account: `demo@studyflow.com` / `password123`)*

---

## Testing & Quality Assurance

### 1. Functional & User Flow Testing
- User Registration & Authentication flow validation.
- Form validation tests (empty inputs, password length, format checking).
- Task state transitions (Pending $\to$ In Progress $\to$ Completed $\to$ Overdue).
- Real-time client-side search and multi-parameter filtering accuracy.
- Course and task cascading deletions.

### 2. API & Network Verification
- HTTP status code adherence (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Internal Error`).
- Secure Bearer JWT token header verification across all protected endpoints.
- SQL injection prevention via prepared parameter binding in `mysql2`.

### 3. Responsive Design Validation
- Tested across desktop viewports (>1024px), tablet viewports (768px–1024px), and mobile viewports (<768px) with adaptive drawers and stacked layouts.

---

## SDLC & Agile Development Approach

The development of StudyFlow followed an **Agile/Scrum iterative lifecycle**:

```
[ Sprint 1: Architecture & Foundations ]
  ├── Schema design, relational model, seed data
  └── Express REST server scaffolding & JWT Auth middleware
[ Sprint 2: Core Academic Modules ]
  ├── Course management & detailed views
  └── Interactive Task Tracker with multi-filter engine
[ Sprint 3: Academic Productivity Features ]
  ├── Assignment tracker & Note-taking module
  └── Dynamic Calendar view & deadline mapping
[ Sprint 4: Analytics, UI Polish & Documentation ]
  ├── Progress metrics, custom CSS activity charts
  └── Comprehensive documentation & deployment blueprints
```

---

## DevOps, Containers & Cloud Deployment

### 1. Version Control & Git Workflow
- Feature-branch workflow with clear semantic commits (`feat:`, `fix:`, `docs:`, `refactor:`).
- Centralized ignore policies for secrets and generated build artifacts (`.env`, `node_modules/`, `build/`).

### 2. Containerization (Docker Architecture)
The application is structured for containerized microservices:
- **Frontend Container**: Multi-stage build with Node build step and NGINX web server serving static assets.
- **Backend Container**: Lightweight Node.js Alpine image running the Express API.
- **Database Container**: Official MySQL 8 image with volume mount for persistent storage.

### 3. Cloud Deployment Strategy
- **Frontend**: Deployable to platforms such as Vercel, Netlify, or AWS S3 + CloudFront.
- **Backend**: Deployable to Render, Railway, AWS ECS, or Heroku with environment variable management.
- **Database**: Managed cloud databases such as AWS RDS, PlanetScale, or Supabase MySQL.

---

## IBM SkillsBuild Concepts Demonstrated

| Concept Area | Practical Implementation in StudyFlow |
|---|---|
| **Web Fundamentals** | Full client-server separation, RESTful conventions, JSON payloads, HTTP headers. |
| **Front-End Development** | React 19 functional components, Custom Hooks (`useAuth`, `useMemo`, `useState`, `useEffect`). |
| **HTML5** | Semantic tags (`<header>`, `<nav>`, `<main>`, `<aside>`, `<section>`, `<article>`), accessible form labels. |
| **CSS3** | CSS Variables design token system, Flexbox layouts, CSS Grid systems, CSS animations, media queries. |
| **JavaScript** | ES6+ async/await, Array filtering/sorting algorithms, date manipulations, token storage. |
| **Database & SQL** | MySQL schema design, Foreign Keys, cascading rules, indexing, connection pooling. |
| **CRUD Operations** | Complete Create, Read, Update, Delete implemented across Courses, Tasks, Assignments, Notes, and User Profiles. |
| **SDLC & Agile** | Iterative sprint-based feature breakdown, modular architecture, continuous validation. |
| **DevOps & Deployment** | Multi-environment config, container blueprints, CI/CD and cloud hosting strategies. |
