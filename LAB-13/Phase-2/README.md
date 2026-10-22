# Campus Lost & Found Management System (Phase 1)

A full-stack web application designed for college campuses to manage lost and found items. Built using Node.js, Express.js, EJS, and MongoDB Atlas with Mongoose.

> **Scope Note:** This repository implements **Phase 1 ONLY** (student registration, reporting lost/found items, listing, filtering, and student profiles). Phase 2 features (claims, approvals, return workflows) are deliberately excluded.

---

## 1. Prerequisites

- **Node.js** (v18.x or later recommended; tested on v24)
- **npm** (comes with Node.js)
- **MongoDB Atlas** cluster account (or local MongoDB instance)
- A modern web browser

---

## 2. Installation & Setup

### Step 1: Clone or open project directory
```bash
cd c:\FSD_Assignments_0075\LAB-13\campus-lost-found
```

### Step 2: Install dependencies
All required dependencies (`express`, `ejs`, `mongoose`, `dotenv`) are already listed in `package.json`:
```bash
npm install
```

### Step 3: Configure environment variables
Create a `.env` file in the root directory (do not commit this file; it is already ignored in `.gitignore`):
```env
# MongoDB Atlas Connection String
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/campusLostFound?retryWrites=true&w=majority

# Web Server Port (defaults to 3000 if omitted)
PORT=3000
```
> Replace `<username>`, `<password>`, and `<cluster>` with your actual MongoDB Atlas database credentials.

---

## 3. Starting the Application

Run the start script defined in `package.json`:

```bash
npm start
```

When successful, your console will output:
```text
Connected to MongoDB Atlas successfully!
Server is running on http://localhost:3000
```

Open your browser and navigate to:
**[http://localhost:3000](http://localhost:3000)**

---

## 4. Implemented Routes

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Home page dashboard with real-time statistics (students, lost items, found items) |
| `GET` | `/students` | Lists all registered students in a responsive table |
| `GET` | `/students/new` | Student registration form (must precede `/:id`) |
| `POST` | `/students` | Validates & saves new student to MongoDB Atlas |
| `GET` | `/students/:id` | Individual student profile displaying their contact info, lost items, and found items |
| `GET` | `/lost-items` | Lost items catalog with dynamic search (item name), category, and location filter |
| `GET` | `/lost-items/new` | Report lost item form with dropdown of registered students |
| `POST` | `/lost-items` | Validates & records lost item linked to a student |
| `GET` | `/lost-items/:id` | Detailed view of a lost item with populated student reporter information |
| `GET` | `/found-items` | Catalog of all reported found items |
| `GET` | `/found-items/new` | Report found item form with dropdown of registered students |
| `POST` | `/found-items` | Validates & records found item linked to a student |
| `GET` | `/found-items/:id` | Detailed view of a found item with populated student reporter information |
| `USE` | `*` | 404 Page Not Found handler for undefined routes |

---

## 5. Database Models & Schema Relationships

### Data Schema Overview

```text
 Student (1) ───────────< (Many) LostItem
     │
     └──────────────────< (Many) FoundItem
```

### 1. `Student` (`models/Student.js`)
| Field | Type | Rules |
| :--- | :--- | :--- |
| `fullName` | String | Required, trimmed |
| `email` | String | Required, unique index, lowercase, trimmed, validated via email regex |
| `department` | String | Required, trimmed |
| `contactNumber` | String | Required, trimmed |
| `timestamps` | Date | `createdAt` and `updatedAt` managed automatically |

### 2. `LostItem` (`models/LostItem.js`)
| Field | Type | Rules |
| :--- | :--- | :--- |
| `itemName` | String | Required, trimmed |
| `category` | String | Required, trimmed |
| `description` | String | Required, trimmed |
| `lastSeenLocation` | String | Required, trimmed |
| `dateLost` | Date | Required |
| `reportedBy` | ObjectId | Required reference to `Student` (`ref: 'Student'`) |
| `status` | String | Default: `'Lost'`, enum: `['Lost', 'Found', 'Returned']` |
| `timestamps` | Date | `createdAt` and `updatedAt` |

### 3. `FoundItem` (`models/FoundItem.js`)
| Field | Type | Rules |
| :--- | :--- | :--- |
| `itemName` | String | Required, trimmed |
| `category` | String | Required, trimmed |
| `description` | String | Required, trimmed |
| `foundLocation` | String | Required, trimmed |
| `dateFound` | Date | Required |
| `reportedBy` | ObjectId | Required reference to `Student` (`ref: 'Student'`) |
| `status` | String | Default: `'Unclaimed'`, enum: `['Unclaimed', 'Claimed', 'Returned']` |
| `timestamps` | Date | `createdAt` and `updatedAt` |

---

## 6. Verification Status & Test Suite

### Automated Test Matrix
| Category | Check | Verification Method | Status | Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **Static** | Dependencies & Scripts | `package.json` inspection | **PASSED** | `express`, `ejs`, `mongoose`, `dotenv` installed; `start` script defined |
| **Static** | JavaScript Syntax | `node --check` | **PASSED** | `index.js` and all models validated without syntax errors |
| **Static** | EJS View Compilation | `ejs.compile` | **PASSED** | All 12 `.ejs` templates compiled successfully |
| **Static** | Asset Existence | File system check | **PASSED** | All 21 required files present |
| **Live DB** | MongoDB Atlas Connection | `mongoose.connect()` | **PASSED** | Successfully authenticated and connected to Atlas |
| **Live DB** | Student Validation | Mongoose Schema Save | **PASSED** | Missing fields and invalid email rejected |
| **Live DB** | Duplicate Email Check | Unique Index (code 11000) | **PASSED** | Duplicate student emails prevented |
| **Live DB** | Lost Item Student Link | ObjectId Reference | **PASSED** | Linked item to student and populated `reportedBy` |
| **Live DB** | Found Item Student Link| ObjectId Reference | **PASSED** | Linked item to student and populated `reportedBy` |
| **Live DB** | Regex-Safe Search Query| MongoDB `$regex` query | **PASSED** | Handled search with special characters like parentheses safely |
| **Live DB** | Clean-up Integrity | Explicit ID deletion | **PASSED** | Test records removed without affecting user data |
| **Smoke** | HTTP Route Smoke Test | Node `http.get` on live server | **PASSED** | 10 endpoints returned expected 200, 400, and 404 codes |

---

## 7. Step-by-Step Viva Demonstration Guide

Follow this sequence to demonstrate Phase 1 features to your evaluator:

### Step 1: Open the Application
1. Start the server: `npm start`
2. Open `http://localhost:3000`
3. Point out the dashboard counters (`Students: 0`, `Lost Items: 0`, `Found Items: 0` if database is new).

### Step 2: Register Students
1. Click **"Register New"** or navigate to `/students/new`.
2. Try submitting an empty form to show browser/server required-field validation.
3. Try entering an invalid email (`john.smith`) to show email pattern validation.
4. Fill in valid details:
   - **Name:** `Riyan Shrestha`
   - **Email:** `riyan@college.edu`
   - **Department:** `Computer Science`
   - **Contact:** `9876543210`
5. Click **"Register Student"** → Redirects to `/students` with green success notification banner.
6. Try registering the exact same email again to show the **"A student with this email already exists"** duplicate handling.

### Step 3: Report a Lost Item
1. Navigate to `/lost-items/new`.
2. Select `Riyan Shrestha` from the student dropdown.
3. Enter details:
   - **Item Name:** `Blue Backpack (Nike)`
   - **Category:** `Bags`
   - **Description:** `Navy blue backpack with a laptop and notebook inside`
   - **Last Seen Location:** `Central Library, 2nd Floor`
   - **Date Lost:** Select today's date
4. Submit report → Redirects to `/lost-items` with success alert.
5. Click **"View Details"** to show:
   - Status badge (`LOST`)
   - Clickable reporter link leading to the student's profile.

### Step 4: Test Search and Filters
1. On `/lost-items`, search for `Backpack` or `(Nike)`.
2. Filter by Category `Bags`.
3. Filter by Location `Library`.
4. Click **"Clear"** to reset filters.

### Step 5: Report a Found Item
1. Navigate to `/found-items/new`.
2. Select the student from the dropdown.
3. Enter details:
   - **Item Name:** `Scientific Calculator`
   - **Category:** `Electronics`
   - **Description:** `Casio fx-991EX calculator found near desk`
   - **Found Location:** `Science Block, Room 201`
   - **Date Found:** Select today's date
4. Submit report → Redirects to `/found-items` with status `UNCLAIMED`.

### Step 6: Verify Student Profile
1. Navigate to `/students` and click **"View"** next to `Riyan Shrestha`.
2. Point out that the student profile automatically shows:
   - Student contact details
   - **Lost Item Reports** table with the reported backpack
   - **Found Item Reports** table with the reported calculator

### Step 7: Error Handling & 404 Demonstration
1. Visit a nonexistent URL like `http://localhost:3000/random-page` → Displays custom responsive `404.ejs` page.
2. Visit `http://localhost:3000/students/invalid-mongo-id` → Displays safe error page stating `"Invalid student ID."` without crashing or printing stack traces.
