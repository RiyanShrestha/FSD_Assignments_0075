# Express Auth System

A REST API for user registration, login, profile access, and an admin-only dashboard. It uses JSON Web Tokens (JWT) for authentication and MongoDB for user storage.

## Tech stack

- Node.js and Express.js
- MongoDB with Mongoose
- bcrypt for password hashing
- jsonwebtoken for signed access tokens
- dotenv for environment configuration

## Prerequisites

- Node.js 18 or later and npm
- MongoDB running locally or a MongoDB connection URI

## Setup and run

1. Open a terminal in the project directory.
2. Create or edit the `.env` file in the project root:

   ```dotenv
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/express-auth-system
   JWT_SECRET=replace-this-with-a-random-secret-at-least-32-characters-long
   ```

   For deployment, replace `JWT_SECRET` with a unique, randomly generated secret of at least 32 characters. Keep `.env` private and out of version control. Change the MongoDB URI if your database is hosted elsewhere.

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   npm start
   ```

   The API listens on `http://localhost:3000` unless `PORT` is changed. MongoDB must be reachable before the server starts.

5. To create an admin account for the protected admin endpoint, run:

   ```bash
   node createAdmin.js
   ```

   By default, the script creates `admin@example.com` with password `admin123`. Override these defaults with `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME` environment variables before running it. Change the sample password immediately and use a strong secret for any real deployment.

## API endpoints

All request bodies use JSON. Protected endpoints require a valid JWT in the `Authorization` header as `Bearer <token>`.

| Method | URL | Required Headers | Body format | Description |
|---|---|---|---|---|
| POST | `/api/auth/register` | `Content-Type: application/json` | `{"name":"Sam Student","email":"sam@example.com","password":"strong-password"}` | Creates a student account, hashes its password, and returns a token and user. |
| POST | `/api/auth/login` | `Content-Type: application/json` | `{"email":"sam@example.com","password":"strong-password"}` | Checks credentials and returns a token and user. |
| GET | `/api/users/profile` | `Authorization: Bearer <token>` | None | Returns the authenticated user's profile. |
| GET | `/api/users/admin` | `Authorization: Bearer <token>` | None | Returns an admin dashboard welcome message; requires the `admin` role. |

## REST Client requests

Open `api-tests.http` in VS Code with the REST Client extension installed. Send the register or login request, copy the returned token into the `@token` variable near the top of the file, and then send either protected request. The admin request requires a token for an account whose role is `admin`.
