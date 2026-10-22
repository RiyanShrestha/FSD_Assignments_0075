# Campus Lost & Found Management System (Phase 1 & Phase 2 Complete)

A full-stack web application designed for college campuses to manage lost and found items, ownership claims, and item return verification. Built using Node.js, Express.js, EJS, and MongoDB Atlas with Mongoose.

> **Scope Note:** This repository implements both **Phase 1** (student registration, reporting lost/found items, catalogs, and student profiles) and **Phase 2** (Claim model, claim submission, server-side session authentication, finder authorization, atomic return workflow, status updates, dynamic search/filter, and edge-case error handling).

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
cd C:\FSD_Assignments_0075\LAB-13\Phase-2
```

### Step 2: Install dependencies
All required dependencies (`express`, `ejs`, `mongoose`, `dotenv`) are listed in `package.json`:
```bash
npm install
```

### Step 3: Configure environment variables
Create or update your `.env` file in the root directory (do not commit this file; it is ignored in `.gitignore`):
```env
# MongoDB Atlas Connection String
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/campusLostFound?retryWrites=true&w=majority

# Web Server Port (defaults to 3000 if omitted)
PORT=3000

# Session Secret (used for signing session cookies)
SESSION_SECRET=campus-lost-found-secret-2026-phase2
```
> Replace `<username>`, `<password>`, and `<cluster>` with your actual MongoDB Atlas database credentials.

---

## 3. Starting the Application

### Start Development/Production Server:
```bash
npm start
```

When successful, your console outputs:
```text
Connected to MongoDB Atlas successfully!
Server is running on http://localhost:3000
```

Open your browser and navigate to:
**[http://localhost:3000](http://localhost:3000)**

### Run Automated Verification Test Suite:
```bash
npm test
```
Executes the comprehensive automated test suite verifying unit validations, duplicate prevention, session authentication, server-side authorization, return workflows, and live HTTP endpoints.

---

## 4. Implemented Routes

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Home page dashboard with real-time statistics (students, lost items, found items, claims) |
| `GET` | `/login` | Student login page (select account from dropdown or enter registered email) |
| `POST` | `/login` | Authenticates student session and issues secure signed session cookie (`clf_session`) |
| `GET`/`POST` | `/logout` | Destroys active student session and clears cookie |
| `GET` | `/students` | Lists all registered students in a responsive table with quick-login buttons |
| `GET` | `/students/new` | Student registration form |
| `POST` | `/students` | Validates & saves new student to MongoDB Atlas (auto-authenticates session) |
| `GET` | `/students/:id` | Student profile displaying contact info, lost items, found items, and submitted claims |
| `GET` | `/lost-items` | Lost items catalog with dynamic search (item name), category, location, and status filters |
| `GET` | `/lost-items/new` | Report lost item form with dropdown of registered students |
| `POST` | `/lost-items` | Validates & records lost item linked to a student |
| `GET` | `/lost-items/:id` | Detailed view of a lost item with populated reporter profile |
| `GET` | `/found-items` | Found items catalog with dynamic search (name), category, location, and status filters |
| `GET` | `/found-items/new` | Report found item form with dropdown of registered students |
| `POST` | `/found-items` | Validates & records found item linked to a student |
| `GET` | `/found-items/:id` | Found item details with claims list (finder view) or claim submission form (claimant view) |
| `POST` | `/found-items/:id/claims` | **(Phase 2)** Validates & records ownership claim (`Pending`) for found item `:id` |
| `PATCH` | `/claims/:id/status` | **(Phase 2)** Approves or rejects a claim (strictly authorized to item reporter via session) |
| `POST` | `/claims/:id/status` | **(Phase 2)** Form companion route supporting browser method override (`_method=PATCH`) |
| `PATCH` | `/found-items/:id/status`| **(Phase 2)** Updates found item status (`Unclaimed`, `Claimed`, `Returned`) |
| `POST` | `/found-items/:id/status` | **(Phase 2)** Form companion route for updating found item status |
| `USE` | `*` | Custom responsive 404 Page Not Found handler |

---

## 5. Database Models & Schema Relationships

### Data Schema Overview

```text
       Student (1) ───────────< (Many) LostItem
           │
           ├──────────────────< (Many) FoundItem
           │                       │
           │                       │ (1)
           │                       │
           │                       ▼
           └──────────────────< (Many) Claim
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

### 4. `Claim` (`models/Claim.js` - Phase 2)
| Field | Type | Rules |
| :--- | :--- | :--- |
| `foundItemId` | ObjectId | Required reference to `FoundItem` (`ref: 'FoundItem'`) |
| `claimedBy` | ObjectId | Required reference to `Student` (`ref: 'Student'`) |
| `reason` | String | Required, trimmed, minimum 5 characters (`minlength: 5`) |
| `status` | String | Default: `'Pending'`, enum: `['Pending', 'Approved', 'Rejected']` |
| `compound index` | Index | `{ foundItemId: 1, claimedBy: 1 }` unique (prevents duplicate claims) |
| `timestamps` | Date | `createdAt` and `updatedAt` |

---

## 6. Phase 2 Architecture & Security Features

### 1. Minimal Secure Session Authentication
- Implemented natively using Node.js `crypto` with HMAC-SHA256 cookie signing (`clf_session`).
- Cookie is protected with `HttpOnly` and `SameSite=Lax` flags to prevent XSS session theft.
- No form-supplied student IDs are trusted for sensitive actions like claim approvals or reviews.

### 2. Server-Side Authorization for Approvals
- When a review request arrives at `PATCH /claims/:id/status`, the server strictly inspects `req.session.studentId`.
- The server verifies: `foundItem.reportedBy.toString() === currentStudentId.toString()`.
- If an unauthenticated user or any other student tries to approve or reject a claim, the request is rejected with `401 Unauthorized` or `403 Forbidden`.

### 3. Consistent Return Workflow
- When a claim is approved:
  1. The found item status is atomically set to `Returned`.
  2. The approved claim status is set to `Approved`.
  3. All other pending claims for that same item are automatically updated to `Rejected`.
- Conflicting approvals are blocked: once an item is marked `Returned`, further approvals on other claims are rejected with `400 Bad Request`.
- Repeated actions are blocked: claims already `Approved` or `Rejected` cannot be reviewed again.

### 4. Duplicate Claim Prevention
- Compound unique index in MongoDB (`{ foundItemId: 1, claimedBy: 1 }`).
- Pre-save validation in `POST /found-items/:id/claims` provides clear, user-friendly feedback if a student has already filed a claim.

### 5. Dynamic Search and Filtering
- Implemented on both `/found-items` and `/lost-items`.
- Supports searching item names (case-insensitive regex with special character escaping via `escapeRegex`).
- Category filtering (`Electronics`, `Books`, `Clothing`, `Accessories`, `Documents`, `Keys`, `Bags`, `Other`).
- Location filtering (case-insensitive regex).
- Status filtering (`Unclaimed`, `Claimed`, `Returned` on found items; `Lost`, `Found`, `Returned` on lost items).
- Informative empty states with "Clear Filters" actions.

---

## 7. Verification Status & Test Suite

Run all verification tests anytime via:
```bash
npm test
```

### Automated Test Matrix
| Category | Check | Verification Method | Status | Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **Static** | Dependencies & Scripts | `package.json` inspection | **PASSED** | Zero extraneous packages installed; `npm test` and `npm start` configured |
| **Static** | JavaScript Syntax | `node --check` | **PASSED** | `index.js`, models, and test suites verified with 0 syntax errors |
| **Static** | EJS View Compilation | `ejs.compile` | **PASSED** | All 13 EJS templates compiled without errors |
| **Model** | Claim Schema & Validation | Mongoose Schema Save | **PASSED** | Validates `foundItemId`, `claimedBy`, reason minimum 5 chars |
| **Model** | Duplicate Claim Prevention | Compound Unique Index | **PASSED** | Code 11000 caught; duplicate claims on same item prevented |
| **Security** | Unauthenticated Review | HTTP PATCH request | **PASSED** | Returned 401 Authentication Required |
| **Security** | Unauthorized Non-Reporter Review | HTTP PATCH request | **PASSED** | Returned 403 Forbidden; browser IDs not trusted |
| **Workflow** | Claim Approval | HTTP PATCH request | **PASSED** | Claim status set to `Approved` |
| **Workflow** | Automatic Return Marking | DB query check | **PASSED** | Found item status automatically changed to `Returned` |
| **Workflow** | Conflicting Claims Deactivation | DB query check | **PASSED** | Remaining pending claims automatically set to `Rejected` |
| **Workflow** | Returned Item Protection | HTTP POST request | **PASSED** | Returned 400 Bad Request; claims on returned items blocked |
| **Workflow** | Repeated Action Rejection | HTTP PATCH request | **PASSED** | Returned 400 Bad Request; already processed claims locked |
| **Filter** | Search & Status Filtering | MongoDB query & HTTP | **PASSED** | Tested regex escaping, category, location, and status filters |
| **Error** | Invalid ObjectId Handling | HTTP GET / PATCH | **PASSED** | Returned 400 Bad Request safely without crashing |
| **Error** | 404 Route Handling | HTTP GET | **PASSED** | Returned custom responsive 404 view |

---

## 8. Step-by-Step Viva Demonstration Guide

Follow this sequence to demonstrate Phase 2 features to your evaluator:

### Step 1: Open the Application & Check Dashboard
1. Run `npm start`.
2. Open `http://localhost:3000`.
3. Notice the 4 dashboard counters: **Students**, **Lost Items**, **Found Items**, and **Claims**.
4. In the top navbar, notice the **Login** link.

### Step 2: Register Two Students
1. Navigate to `/students/new`.
2. Register the finder:
   - **Name:** `Alex Finder`
   - **Email:** `alex@college.edu`
   - **Department:** `Computer Science`
   - **Contact:** `9876543210`
3. Notice that Alex is automatically logged in (navbar shows `👤 Alex`).
4. Register the owner:
   - Click `/students/new`.
   - **Name:** `Sam Owner`
   - **Email:** `sam@college.edu`
   - **Department:** `Mechanical`
   - **Contact:** `9123456780`
5. Notice that Sam is now the active logged-in user.

### Step 3: Alex Reports a Found Item
1. Switch active student to Alex: navigate to `/students` and click **"Log In"** next to `Alex Finder` (or go to `/login`).
2. Navigate to `/found-items/new`.
3. Fill in item details:
   - **Item Name:** `Titan Quartz Watch`
   - **Category:** `Accessories`
   - **Description:** `Silver watch with blue dial and leather strap`
   - **Found Location:** `Library Reading Hall, Desk 12`
   - **Date Found:** Select today's date
   - **Reported By:** Select `Alex Finder`
4. Click **"Submit Report"** → Redirects to `/found-items` showing the item with status `UNCLAIMED`.

### Step 4: Sam Submits an Ownership Claim
1. Switch active student to Sam: click **"Log In"** next to `Sam Owner` on `/students` or click `/login`.
2. Navigate to `/found-items` and click **"View Details"** on the Titan Quartz Watch.
3. Notice: Because Sam is logged in, the page displays: **"Claiming As: Sam Owner (sam@college.edu)"**.
4. Try submitting a reason shorter than 5 characters (e.g. `Mine`) → Browser/server minlength validation rejects it.
5. Enter a valid reason: `Silver Titan watch with dark blue dial and small scratch near the 3 o'clock mark.`
6. Click **"Submit Claim"** → Page reloads with a green alert: `"Claim submitted successfully!"`.
7. Notice: The page now displays **"Your Claim Status: PENDING"** with the reason Sam provided.
8. Point out: The claim form is now hidden for Sam, preventing duplicate submissions.

### Step 5: Test Unauthorized Review Protection
1. While still logged in as Sam, try to approve the claim. Notice there are NO approve/reject buttons visible to Sam.
2. Even if an attacker attempts to send `PATCH /claims/:id/status` directly, the server checks the session and returns `403 Forbidden` because Sam is not the student who reported the found item.

### Step 6: Alex Approves the Claim & Workflow Executes
1. Switch back to Alex: go to `/students` and click **"Log In"** next to `Alex Finder`.
2. Navigate to `/found-items` and open the Titan Quartz Watch details page.
3. Notice: Because Alex is the verified finder, Alex sees the **"Claims Received (1)"** table!
4. Point out the claim details: Claimant name, contact info, claim reason, date, and two action buttons: **[Approve]** (green) and **[Reject]** (red).
5. Click **[Approve]** and confirm the dialog.
6. Observe the immediate changes:
   - Green banner: `"Claim approved successfully! The item has been marked as Returned."`
   - Item status badge changes to **`RETURNED`**.
   - Claim status in the table changes to **`Approved (✓ Returned to claimant)`**.
   - If there were any other pending claims from other students, they are automatically set to `Rejected`.

### Step 7: Verify Return Workflow Protections
1. Switch back to Sam or view as any student.
2. Notice the message: `"Item Status: Returned - This item has already been verified and returned to its rightful owner. New claims cannot be submitted."`
3. The claim submission form is permanently closed.
4. Check Sam's profile (`/students/:id`): Under **"Claims Submitted by this Student"**, the watch claim shows status **`Approved`**.

### Step 8: Test Search & Filtering
1. Navigate to `/found-items`.
2. Type `Watch` in the search box and click **Search** → Matches the Titan Quartz Watch.
3. Select status **Returned** → Displays the returned watch.
4. Select status **Unclaimed** → Displays empty state: `"No found items match your criteria"` with a **"Clear Filters"** button.
5. Click **"Clear Filters"** → Resets filters back to all items.
6. Repeat similarly on `/lost-items`.

### Step 9: Test Error Handling
1. Navigate to `/found-items/invalid-mongo-id-123` → Safe error page: `"Invalid found item ID."` (HTTP 400).
2. Navigate to `/random-missing-url` → Custom responsive 404 page (HTTP 404).
3. The application never crashes and never leaks sensitive stack traces or database connection credentials.
