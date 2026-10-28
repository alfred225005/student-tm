# StudyFlow — Student Task Management System

A beginner-friendly MERN stack assignment for organizing student assignments, due dates, priorities and progress.

## Features
- Register and log in with password hashing and JWT authentication
- Private per-user task records
- Create, read, update and delete tasks
- Task status: Pending, In Progress, Completed
- Task priority: Low, Medium, High
- Search, filter and dashboard totals
- Responsive React interface
- Server-side validation, protected routes, safe error messages and login rate limiting

## Technology
React + Vite, CSS, Node.js, Express, MongoDB Atlas, Mongoose, bcryptjs, JSON Web Tokens, Axios, Git and GitHub.

## Requirements
Install a current Node.js LTS release, npm, Git, and a MongoDB Atlas account.

## Setup
1. Clone/download this repository and open the `student-task-manager` folder in VS Code.
2. Configure MongoDB Atlas: create a cluster and database user, allow your development IP address in Network Access, and copy the application's connection string. Never share the real connection string.
3. In `server/`, copy `.env.example` to `.env`. Fill in `MONGODB_URI`, a long random `JWT_SECRET` (at least 32 characters), and keep `CLIENT_URL=http://localhost:5173` for local development.
4. In a terminal:
   ```bash
   cd server
   npm install
   npm run dev
   ```
5. In a second terminal:
   ```bash
   cd client
   npm install
   ```
   Copy `client/.env.example` to `client/.env` and keep `VITE_API_URL=http://localhost:5000/api`.
   Then run:
   ```bash
   npm run dev
   ```
6. Open the Vite URL printed in the terminal, normally `http://localhost:5173`.

## API
- `GET /api/health` — health check
- `POST /api/auth/register` — create an account
- `POST /api/auth/login` — log in
- `GET /api/tasks` — list the current user's tasks
- `POST /api/tasks` — create a task
- `PUT /api/tasks/:id` — update a task
- `DELETE /api/tasks/:id` — delete a task

Task routes require `Authorization: Bearer <token>`. The API validates input and scopes task operations to the logged-in user.

## Test checklist
- Register with a valid name, email and password of at least 8 characters.
- Try registering the same email again; it should be rejected.
- Log in with a wrong password; it should be rejected.
- Add a task with title, due date, priority and status.
- Edit the task, mark it completed, search for it and filter by status.
- Delete a task after confirming the prompt.
- Register a second test user and verify that the first user's tasks are not visible to them.
- Try submitting an empty title; the form/API should reject it.
- Test at desktop and mobile widths.

## Security and limitations
- Never commit `.env`, database credentials, JWT secrets, real passwords or personal data.
- JWT is stored in browser localStorage in this student demo. For a production system, evaluate secure, HttpOnly cookie-based sessions and related CSRF protections.
- The list endpoint currently returns at most 200 tasks; pagination can be added later.
- Test locally before deploying. Configure production CORS and environment variables on the hosting provider.

## Project report
Use the ICTAK Summer Internship Report template. Document the actual project purpose, objectives, scope, methodology, activities, tested results, screenshots, conclusion and appendix. Do not claim tests or deployment succeeded until you have completed them.
