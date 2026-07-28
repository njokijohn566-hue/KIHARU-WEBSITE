# Student Portal - API Postman Collection

## Import Instructions

1. Open Postman
2. Click "Import"
3. Select this file or paste the JSON below
4. Create environment with variables:
   - `base_url`: http://localhost:5000/api
   - `token`: (will be set after login)

## Authentication

First run: **POST Auth > Login**
- This will return a token
- Set in environment: `token` variable

---

## Available Endpoints

### Authentication
- POST /auth/register - Register new student
- POST /auth/login - Login
- POST /auth/refresh - Refresh token

### Students
- GET /students/me - Get profile
- GET /students/profile-stats - Get stats
- PUT /students/profile - Update profile

### Grades
- GET /grades - Get all grades
- GET /grades/by-year - Filter by year
- GET /grades/transcript - Get transcript

### Courses
- GET /courses - Available courses
- GET /courses/:id - Course details
- GET /courses/enrolled - My courses

### Enrollments
- POST /enrollments - Register course
- DELETE /enrollments/:id - Drop course

### Fees
- GET /fees - Fee info
- GET /fees/invoice/:semester - Invoice

### Payments
- POST /payments - Initiate payment
- POST /payments/confirm - Confirm payment
- GET /payments/history - Payment history

### Assignments
- GET /assignments - All assignments
- GET /assignments/:id - Assignment details
- GET /assignments/course/:id - Course assignments

### Submissions
- POST /submissions - Submit assignment
- GET /submissions - My submissions
- GET /submissions/:id - Submission details

---

## Environment Setup

```json
{
  "base_url": "http://localhost:5000/api",
  "token": "",
  "studentId": 1,
  "courseId": 1
}
```

After login, the token will be automatically set for subsequent requests.
