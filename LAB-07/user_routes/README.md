# Node.js Lab – User Routes (Even & Odd IDs)

## Description
A beginner-friendly Node.js and Express.js project that demonstrates routing, serving static files, handling form submissions, and filtering data by even and odd user IDs.

## Technologies Used
- Node.js
- Express.js

## Installation
```bash
npm install
```

## How to Run
```bash
npm start
```
Server runs at: **http://localhost:3000**

For development with auto-reload:
```bash
npm run dev
```

## Available Routes

| Route | Description |
|---|---|
| `/` | Home – displays "We are learning Node.js" |
| `/users` | Returns all 6 users in JSON |
| `/users/odd` | Returns users with odd IDs (1, 3, 5) |
| `/users/even` | Returns users with even IDs (2, 4, 6) |
| `/about` | About page with Node.js & Express.js info |
| `/register` | Registration form (First Name, Last Name) |
| `/download-logo` | Downloads the project logo |

## Odd & Even Routes
- **`/users/odd`** – Filters users where `user.id % 2 !== 0` (IDs: 1, 3, 5)
- **`/users/even`** – Filters users where `user.id % 2 === 0` (IDs: 2, 4, 6)

These are implemented as two separate routes to demonstrate array filtering in Express.

## Node.js Concepts Practiced
- **Promises** – `examples/promise.js`
- **Async/Await** – `examples/async-await.js`
- **FS Module** – `examples/fs-example.js`
- **Events Module** – `examples/events-example.js`
- **Streams** – `examples/stream-example.js`

Run any example with:
```bash
node examples/promise.js
```
