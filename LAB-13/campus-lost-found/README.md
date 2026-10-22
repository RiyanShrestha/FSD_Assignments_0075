# Campus Lost & Found Management System

A full-stack web application for managing lost and found items on a college campus. Built as a college assignment using Node.js, Express.js, EJS, and MongoDB Atlas.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Templating:** EJS
- **Database:** MongoDB Atlas (via Mongoose)
- **Environment Config:** dotenv
- **Styling:** Custom CSS (responsive)

## Project Structure

```
campus-lost-found/
├── index.js                    # Main server file (routes + DB connection)
├── .env                        # Environment variables (not committed)
├── .env.example                # Template for .env
├── .gitignore                  # Files to ignore in Git
├── package.json
├── models/
│   ├── Student.js              # Student schema
│   ├── LostItem.js             # Lost item schema
│   └── FoundItem.js            # Found item schema
├── views/
│   ├── home.ejs                # Dashboard / home page
│   ├── students.ejs            # Student listing
│   ├── student-form.ejs        # Student registration form
│   ├── student-details.ejs     # Individual student profile
│   ├── lost-items.ejs          # Lost items listing (with search)
│   ├── lost-item-form.ejs      # Report lost item form
│   ├── lost-item-details.ejs   # Individual lost item details
│   ├── found-items.ejs         # Found items listing
│   ├── found-item-form.ejs     # Report found item form
│   ├── found-item-details.ejs  # Individual found item details
│   ├── 404.ejs                 # Page not found
│   └── error.ejs               # General error page
├── public/
│   └── styles.css              # Application stylesheet
└── README.md
```

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/campusLostFound?retryWrites=true&w=majority
PORT=3000
```

Replace `<username>`, `<password>`, and `<cluster>` with your MongoDB Atlas credentials.

### 3. Start the application

```bash
npm start
```

The server will start at `http://localhost:3000` after connecting to MongoDB.

## Routes

| Method | Route              | Description                    |
| ------ | ------------------ | ------------------------------ |
| GET    | `/`                | Home page with dashboard stats |
| GET    | `/students`        | List all students              |
| GET    | `/students/new`    | Student registration form      |
| POST   | `/students`        | Create a new student           |
| GET    | `/students/:id`    | View student profile           |
| GET    | `/lost-items`      | List lost items (with search)  |
| GET    | `/lost-items/new`  | Report lost item form          |
| POST   | `/lost-items`      | Create a lost item report      |
| GET    | `/lost-items/:id`  | View lost item details         |
| GET    | `/found-items`     | List all found items           |
| GET    | `/found-items/new` | Report found item form         |
| POST   | `/found-items`     | Create a found item report     |
| GET    | `/found-items/:id` | View found item details        |

## Database Models

### Student
- `fullName` (String, required)
- `email` (String, required, unique, validated format)
- `department` (String, required)
- `contactNumber` (String, required)

### LostItem
- `itemName` (String, required)
- `category` (String, required)
- `description` (String, required)
- `lastSeenLocation` (String, required)
- `dateLost` (Date, required)
- `reportedBy` (ObjectId → Student, required)
- `status` (String, default: "Lost")

### FoundItem
- `itemName` (String, required)
- `category` (String, required)
- `description` (String, required)
- `foundLocation` (String, required)
- `dateFound` (Date, required)
- `reportedBy` (ObjectId → Student, required)
- `status` (String, default: "Unclaimed")

## Phase 1 Features

- Student registration with validation
- Lost item reporting linked to students
- Found item reporting linked to students
- Search/filter lost items by name, category, or location
- Dashboard with live counts
- Student profiles showing their reported items
- Form validation and error messages
- Responsive design

## Author

Built for FSD Lab Assignment.
