# StudyFlow — Your Personal Academic Workspace

A modern, responsive student academic productivity web application designed to help learners manage courses, organize tasks and assignments, record structured notes, visualize deadlines on an interactive calendar, and track academic performance with dynamic analytics.

This project serves as a comprehensive demonstration of **HTML, CSS, JavaScript, React, and Full-Stack Web Development** concepts from the **IBM SkillsBuild Web Development Fundamentals** certification curriculum.

---

## Table of Contents

- [Overview & Objectives](#overview--objectives)
- [Key Features](#key-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Directory Structure](#directory-structure)
- [Setup & Installation](#setup--installation)
- [Running the Application](#running-the-application)
- [Features Demonstration](#features-demonstration)
- [Responsive Design](#responsive-design)
- [Deployment](#deployment)
- [IBM SkillsBuild Concepts Demonstrated](#ibm-skillsbuild-concepts-demonstrated)

---

## Overview & Objectives

### Problem Statement

College students frequently juggle multiple courses, assignments with overlapping deadlines, unstructured lecture notes, and scattered academic tasks. Standard generic to-do apps lack academic context such as course associations, semester tracking, syllabus progress metrics, and integrated scheduling.

### Objectives

1. **Centralized Academic Workspace**: Provide a unified interface for courses, tasks, assignments, notes, and schedules.
2. **Interactive Productivity Workflows**: Support task management with instant search, multi-field filtering, priority flags, and completion states.
3. **Actionable Analytics**: Deliver real-time visual progress indicators, course completion rates, and productivity metrics.
4. **Production Engineering Standards**: Demonstrate modular React architecture, responsive design, client-side state management, and best practices in web development.

---

## Key Features

### 1. Landing Page & Authentication

- **Modern Landing Page**: High-conversion hero section with feature showcases and clear CTAs.
- **Frontend-Only Authentication**: Demo mode - accepts any non-empty email/password combination.
- **Session Persistence**: User session stored in browser localStorage, persists across page refreshes.
- **Protected Routes**: Routes automatically redirect unauthenticated users to login.

### 2. Dynamic Dashboard

- **Overview Cards**: 
  - Total courses enrolled
  - Active (pending/in-progress) tasks
  - Completed tasks
  - Total assignments
- **Upcoming Deadlines**: Next 7 days of due tasks and assignments, sorted by due date.
- **Recent Activity Timeline**: Latest changes to courses, tasks, assignments, and notes.
- **Course Progress Visualization**: Color-coded progress bars for all enrolled courses.
- **Quick Action Links**: Fast navigation to all major features.

### 3. Course Management (Full CRUD)

- **Course Grid View**: Card-based display with course code, instructor, semester, credits, and status.
- **Color-Coded Status Badges**: Visual indicators for active, completed, or dropped courses.
- **Progress Tracking**: Course syllabus completion percentage with visual progress bar.
- **Linked Statistics**: Shows count of associated tasks and assignments per course.
- **Add/Edit Course**: Modal form with validation for course name, instructor, semester, and credits.
- **Delete Course**: Confirmation dialog before deletion.
- **Course Detail View**: Dedicated page showing course info with tabbed sections (not yet fully detailed in UI).

### 4. Task Management (Full CRUD)

- **Task List View**: Table with title, priority, due date, course, and status.
- **Task States**: Pending, In Progress, Completed, auto-detected Overdue status.
- **Quick Toggle**: Click to mark tasks complete/incomplete directly from list.
- **Priority Levels**: High, Medium, Low with color-coded badges.
- **Real-Time Filters**:
  - Search by task title
  - Filter by status (all, pending, in-progress, completed, overdue)
  - Filter by priority
  - Filter by course
  - Sort by various fields
- **Add/Edit Task**: Modal with title, description, due date picker, course selector, and priority.
- **Delete Task**: Confirmation dialog.
- **Development Logging**: Console logs track task creation, completion, and updates for educational purposes.

### 5. Assignment Tracker

- **Assignment List**: View all assignments with deadline classification.
- **Assignment States**: Upcoming, Due Soon (within 3 days), Overdue, Completed.
- **Grade Tracking**: Optional grade field (0-100) for completed assignments.
- **Priority Management**: High, Medium, Low priority classification.
- **Full CRUD**: Add, edit, view, and delete assignments.
- **Course Association**: Link assignments to specific courses.

### 6. Academic Notes

- **Notes Grid**: Responsive card layout for organizing study materials.
- **Course Association**: Filter notes by associated course.
- **Instant Search**: Keyword search across note titles and content.
- **Full CRUD**: Create, edit, view, and delete notes.
- **Rich Content**: Store detailed notes, code examples, and revision tips.
- **Tags**: Optional tag system for better organization.

### 7. Interactive Calendar

- **Monthly View**: Full month calendar grid with Sun-Sat layout.
- **Month Navigation**: Previous/next month controls and "today" button.
- **Event Indicators**: 
  - Blue badges for tasks due on specific dates
  - Purple badges for assignments due on specific dates
- **Date Selection**: Click any date to see all tasks and assignments due that day.
- **Date Detail Panel**: Shows all scheduled items in a scrollable list when date is selected.

### 8. Progress & Analytics

- **Overall Completion Rate**: Circular progress indicator showing completed tasks/assignments as percentage.
- **Course Completion Bars**: Individual progress bars for each course with completion percentage.
- **Average Grade**: If assignments have grades, shows average across all graded assignments.
- **Task Metrics**:
  - Total tasks created
  - Tasks completed
  - Tasks in progress
  - Tasks pending
  - Overdue tasks
- **Assignment Metrics**:
  - Total assignments
  - Assignments completed
  - Assignments pending
  - Average grade (if available)

### 9. Profile & Settings

- **Personal Information**:
  - Full name display
  - Email address
  - Major/Field of study
  - Academic term
  - University/Institution
  - Personal bio
- **Update Profile**: Save changes to personal details.
- **Preferences**:
  - Theme mode (Light/Dark - prep for future implementation)
  - Task reminders toggle
  - Email digests toggle
- **Security** (Demo Mode):
  - Password change interface
  - Confirmation password matching validation
- **Demo Controls**:
  - Reset all data back to initial seed state
  - Useful for testing and demonstrations

---

## Architecture & Tech Stack

### Application Architecture

```
┌─────────────────────────────────────────────┐
│   Browser / React Client (Port 3000)        │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ React Components (Pages & Layouts)    │ │
│  │ ├── Dashboard                         │ │
│  │ ├── Courses                           │ │
│  │ ├── Tasks                             │ │
│  │ ├── Assignments                       │ │
│  │ ├── Notes                             │ │
│  │ ├── Calendar                          │ │
│  │ ├── Progress                          │ │
│  │ └── Profile                           │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ State Management                      │ │
│  │ ├── React Context (Auth, Toasts)      │ │
│  │ └── useState / useEffect Hooks        │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Services Layer                        │ │
│  │ ├── api.js (CRUD operations)          │ │
│  │ ├── storage.js (localStorage)         │ │
│  │ └── network.js (fetch wrapper)        │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
                    │
                    │ Fetch JSON
                    ▼
┌─────────────────────────────────────────────┐
│  Browser Storage (localStorage)             │
│                                             │
│  ├── User session (name, email)            │
│  ├── Courses array                         │
│  ├── Tasks array                           │
│  ├── Assignments array                     │
│  ├── Notes array                           │
│  ├── Preferences (theme, notifications)    │
│  └── Seed data marker                      │
└─────────────────────────────────────────────┘
                    │
                    │ Load (first time only)
                    ▼
┌─────────────────────────────────────────────┐
│  /public/data/seed.json                     │
│  (Initial demo dataset)                     │
└─────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend Framework**: 
  - React 19.2.8 (Functional components, hooks)
  - React Router 7.18.2 (Client-side routing)
  - React Icons 5.7.0 (Icon library)
  - Create React App (Build tooling)

- **State Management**:
  - React Context API (Authentication, Toast notifications)
  - useState/useEffect hooks (Local component state)

- **Data Storage**:
  - Browser localStorage (Persistent client-side storage)
  - JSON seed data (/public/data/seed.json)

- **Styling**:
  - Vanilla CSS (No frameworks)
  - CSS Variables (Design tokens)
  - Flexbox & CSS Grid (Responsive layouts)
  - CSS Animations & Transitions

- **Development**:
  - Node.js / npm (Package management)
  - ESLint (Code quality)
  - react-scripts (Build and dev server)

---

## Directory Structure

```
study_flow_app/
├── public/
│   ├── index.html                 # Main HTML entry point
│   ├── manifest.json              # PWA manifest
│   ├── robots.txt
│   └── data/
│       └── seed.json              # Initial demo dataset
│
├── src/
│   ├── App.js                     # Root app component & routing
│   ├── index.js                   # React entry point
│   │
│   ├── components/
│   │   ├── common/                # Reusable UI components
│   │   │   ├── EmptyState.js/css
│   │   │   ├── LoadingSpinner.js/css
│   │   │   └── Modal.js/css
│   │   │
│   │   └── layout/                # Layout wrappers
│   │       ├── Header.js/css
│   │       ├── Layout.js/css
│   │       └── Sidebar.js/css
│   │
│   ├── context/                   # React Context providers
│   │   ├── AuthContext.js         # Authentication state
│   │   └── ToastContext.js        # Toast notification state
│   │
│   ├── pages/                     # Page components (one per route)
│   │   ├── Landing.js/css         # Public landing page
│   │   ├── Login.js               # Login form
│   │   ├── Register.js            # Registration form
│   │   ├── Dashboard.js/css       # Main dashboard
│   │   ├── Courses.js/css         # Course list & CRUD
│   │   ├── CourseDetail.js/css    # Individual course details
│   │   ├── Tasks.js/css           # Task list & CRUD
│   │   ├── Assignments.js/css     # Assignment list & CRUD
│   │   ├── Notes.js/css           # Notes list & CRUD
│   │   ├── Calendar.js/css        # Interactive calendar view
│   │   ├── Progress.js/css        # Analytics & progress
│   │   ├── Profile.js/css         # User profile & settings
│   │   └── NotFound.js            # 404 page
│   │
│   ├── services/                  # Business logic & data access
│   │   ├── api.js                 # All CRUD services
│   │   ├── storage.js             # localStorage abstraction
│   │   └── network.js             # fetch wrapper with logging
│   │
│   └── styles/                    # Global styles
│       ├── global.css             # Base styles & resets
│       ├── variables.css          # Design tokens & CSS variables
│       └── auth.css               # Auth-specific styles
│
├── build/                         # Production build output
├── node_modules/                  # Dependencies
├── package.json                   # Dependencies & scripts
├── package-lock.json
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

---

## Setup & Installation

### Prerequisites

- Node.js 14.0 or higher
- npm 6.0 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation Steps

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd study_flow_app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **(Optional) Create `.env` file**:
   ```bash
   cp .env.example .env
   ```
   The default `REACT_APP_API_URL` is not currently used (frontend-only architecture), but exists for future backend integration.

---

## Running the Application

### Development Mode

```bash
npm start
```

This starts the React development server on **http://localhost:3000**.

Features:
- Hot module reloading (changes auto-refresh)
- Development server with debugging tools
- console logs visible in browser DevTools

### Production Build

```bash
npm run build
```

Creates an optimized production build in the `build/` directory (~98 kB gzipped JavaScript + 10 kB CSS).

The build is ready for deployment to any static hosting service (Netlify, Vercel, GitHub Pages, AWS S3, etc.).

### Running the Production Build Locally

```bash
npm install -g serve
serve -s build
```

Serves the production build on **http://localhost:3000**.

---

## Features Demonstration

### Demo User

The application runs in **demo mode** - any non-empty email and password are accepted:

- **Email**: `demo@example.com` (or any email-like string)
- **Password**: `password123` (or any non-empty string)

### Demo Data

Initial seed data includes:

**5 Courses:**
- Web Development (CS301) - 65% progress
- UX Evaluation (DES205) - 45% progress
- Database Systems (CS305) - 70% progress
- Data Structures (CS202) - 80% progress
- Operating Systems (CS310) - 35% progress

**8 Tasks** (with mixed completion states)
**6 Assignments** (with grades for some)
**Multiple Notes** (organized by course)

Reset demo data anytime from Profile → "Reset Demo Dataset" button.

### Real User Interactions

- **Create Courses**: Click "Add Course" on Courses page
- **Complete Tasks**: Click task checkbox or "Mark Complete" button
- **Add Notes**: Click "Add Note" on Notes page
- **Filter Data**: Use search bars and dropdown filters on any page
- **View Calendar**: Interactive month view with clickable dates
- **Check Progress**: See overall and per-course completion metrics
- **Update Profile**: Edit personal info and preferences

### Development Console Logging

For demonstration purposes, important actions log to the browser console:
- Form submissions (login, registration, create, update, delete)
- Network requests (seed data fetch)
- Authentication state changes
- Success/failure outcomes

Example:
```
[StudyFlow Form]
  Course created
  Name: Web Design Fundamentals
  Course ID: 6
```

View in browser DevTools → Console tab.

---

## Responsive Design

The application is fully responsive and tested on:

- **Desktop**: 1920×1080, 1366×768, 1024×768
- **Tablet**: 768×1024 (iPad)
- **Mobile**: 390×844 (iPhone 12), 375×812 (iPhone X)

Responsive features:
- **Sidebar**: Collapses to hamburger menu on mobile
- **Cards**: Stack vertically on small screens, grid on large screens
- **Modals**: Full-screen on mobile, centered window on desktop
- **Tables**: Horizontal scroll or card view on mobile
- **Calendar**: Compact month view, tappable dates on mobile
- **Forms**: Full-width inputs on mobile, 2-column on desktop

---

## Deployment

### Netlify (Recommended)

1. Push code to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Deploy with one click

**Note**: Ensure the `_redirects` file exists in `public/` for SPA routing:
```
/* /index.html 200
```

### Vercel

```bash
npm install -g vercel
vercel
```

### GitHub Pages

1. Add `"homepage": "https://yourusername.github.io/study_flow_app"` to `package.json`
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Add scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
4. Deploy: `npm run deploy`

### Docker (Future Enhancement)

A Dockerfile can be added for containerized deployment:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/public/_redirects /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## IBM SkillsBuild Concepts Demonstrated

This project comprehensively demonstrates **IBM SkillsBuild Web Development Fundamentals** concepts:

### Web Fundamentals
- ✅ Client/server architecture concepts (frontend-only architecture)
- ✅ HTTP/HTTPS concepts (fetch API usage)
- ✅ Request/response cycle (async operations with simulated delays)

### HTML
- ✅ Semantic HTML elements (`<header>`, `<main>`, `<nav>`, `<footer>`, `<section>`, `<article>`)
- ✅ Forms with proper labels and accessibility attributes
- ✅ Structured document outline
- ✅ Meta tags and accessibility features

### CSS
- ✅ Box model (padding, margin, border)
- ✅ Flexbox layout (sidebar, cards, buttons)
- ✅ CSS Grid (dashboard layout, course cards)
- ✅ Media queries (responsive design)
- ✅ CSS Variables (design tokens)
- ✅ Animations and transitions
- ✅ Pseudo-classes and pseudo-elements (`:hover`, `:focus`, `:before`, `:after`)

### JavaScript
- ✅ Variables (const, let)
- ✅ Functions (arrow functions, callbacks)
- ✅ Events (click, submit, change, input)
- ✅ DOM manipulation (state-driven via React)
- ✅ Asynchronous operations (async/await, Promise)
- ✅ Data structures (objects, arrays)
- ✅ Array methods (map, filter, find, reduce)
- ✅ Validation and error handling
- ✅ JSON serialization/deserialization

### React
- ✅ Functional components
- ✅ Hooks (useState, useEffect, useContext, useCallback, useMemo)
- ✅ Component composition and reusability
- ✅ Props drilling and Context API
- ✅ Controlled components and form handling
- ✅ Conditional rendering
- ✅ Lists and keys (fixed key warning in Dashboard)
- ✅ React Router (navigation and protected routes)
- ✅ Performance optimization (useCallback, memoization)

### State & Data Management
- ✅ Local state (useState)
- ✅ Global state (Context API)
- ✅ Derived state and computed values
- ✅ Form state management
- ✅ Loading, success, error states

### API & Services
- ✅ Fetch API with custom wrapper
- ✅ Simulated async delays (network simulation)
- ✅ Service-oriented architecture (api.js, storage.js, network.js)
- ✅ Error handling and logging
- ✅ Data persistence (localStorage)

### Forms & Validation
- ✅ Form handling (controlled inputs)
- ✅ Client-side validation
- ✅ Error messages and feedback
- ✅ Form submission handling
- ✅ Password confirmation matching

### Events & Interactivity
- ✅ Click handlers
- ✅ Form submission
- ✅ Input change handlers
- ✅ Event delegation
- ✅ Event prevention (e.preventDefault())

### Accessibility
- ✅ ARIA labels and roles
- ✅ Semantic HTML
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Alert announcements (toast notifications)

### Development Tools & Practices
- ✅ Browser DevTools (Console, Network, Elements)
- ✅ Package management (npm)
- ✅ Build tools (webpack via react-scripts)
- ✅ Code organization and modules
- ✅ ESLint configuration
- ✅ .gitignore and environment files

### Version Control
- ✅ Git repository structure
- ✅ .gitignore best practices
- ✅ Meaningful project organization

### SDLC Concepts
- ✅ Requirements gathering (problem statement)
- ✅ Design (component architecture, data flow)
- ✅ Implementation (React components, services)
- ✅ Testing (manual end-to-end testing)
- ✅ Deployment readiness (production build, deployment guides)

### Responsive Design
- ✅ Mobile-first approach
- ✅ CSS Media queries
- ✅ Viewport configuration
- ✅ Flexible layouts (Flexbox, Grid)
- ✅ Touch-friendly UI elements

### Performance & Optimization
- ✅ Code splitting (React Router lazy loading ready)
- ✅ CSS optimization
- ✅ Gzip compression (verified in build output)
- ✅ Asset management

---

## Troubleshooting

### Issue: Pages take a long time to load

**Cause**: Simulated async delays in services to demonstrate real API behavior.

**Solution**: This is intentional to simulate realistic network requests. It improves after the first load due to localStorage caching.

### Issue: Data resets when browser localStorage is cleared

**Cause**: Frontend-only architecture stores data in localStorage.

**Solution**: 
- Don't clear browser data, or
- Use Profile → "Reset Demo Dataset" to restore seed data, or
- Refresh page after clearing (will re-fetch seed data)

### Issue: Changes not reflecting immediately

**Cause**: Component state might not be updating due to missing key props.

**Solution**: Ensure unique keys in lists. This was fixed in Dashboard.js - other pages verified.

### Issue: Toast notifications not appearing

**Cause**: ToastContext might not be wrapping the component tree.

**Solution**: Verify ToastProvider wraps App in index.js (confirmed correct).

---

## Future Enhancements

Potential features for future versions:

1. **Backend Integration**: Connect to real Express/Node.js backend with MySQL database
2. **User Authentication**: Replace demo mode with real JWT authentication
3. **Dark Mode**: Fully implement theme switcher
4. **Notifications**: Real push notifications for upcoming deadlines
5. **Collaborative Features**: Share notes and tasks with classmates
6. **Mobile App**: React Native version for iOS/Android
7. **Offline Support**: Service Workers for offline functionality
8. **Advanced Analytics**: Charts and graphs using Chart.js
9. **Email Integration**: Send grade reports and deadline reminders
10. **API Documentation**: Swagger/OpenAPI documentation for backend

---

## License

This project is part of the IBM SkillsBuild Web Development Fundamentals certification curriculum.

---

## Contact & Support

For issues or questions about this project, please open an issue on the project repository or contact the development team.

---

**Last Updated**: August 18, 2026
**Version**: 1.0.0
**Status**: Production Ready
