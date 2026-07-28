# Backend Setup Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- npm or yarn

## Installation

```bash
cd backend
npm install
```

## Environment Variables

Create a `.env` file:

```env
NODE_ENV=development
DATABASE_URL=postgresql://student_user:secure_password_change_me@localhost:5432/student_portal
JWT_SECRET=your_jwt_secret_key_change_this
JWT_EXPIRE=7d
PORT=5000
CLIENT_URL=http://localhost:3000
```

## Database Setup

### Option 1: Using Docker Compose (Recommended)

From the root directory:

```bash
docker-compose up -d postgres
```

The database will be initialized with the schema from `db/schema.sql`.

### Option 2: Local PostgreSQL

```bash
# Create database
psql -U postgres
CREATE DATABASE student_portal;
CREATE USER student_user WITH PASSWORD 'secure_password_change_me';
GRANT ALL PRIVILEGES ON DATABASE student_portal TO student_user;

# Run schema
psql -U student_user -d student_portal -f db/schema.sql
```

## Running the Server

### Development

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Production

```bash
npm run build
npm start
```

## API Documentation

### Authentication Endpoints

**POST /api/auth/register**
- Register new student
- Body: `{ email, password, firstName, lastName, studentId, dateOfBirth }`

**POST /api/auth/login**
- Login student
- Body: `{ email, password }`
- Returns: JWT token

**POST /api/auth/refresh**
- Refresh authentication token
- Headers: `Authorization: Bearer {token}`

### Student Endpoints

**GET /api/students/me**
- Get current student profile
- Headers: `Authorization: Bearer {token}`

**GET /api/students/profile-stats**
- Get profile with statistics
- Headers: `Authorization: Bearer {token}`

**PUT /api/students/profile**
- Update student profile
- Headers: `Authorization: Bearer {token}`
- Body: `{ phone, address, city, country }`

### Grades Endpoints

**GET /api/grades**
- Get all student grades
- Headers: `Authorization: Bearer {token}`

**GET /api/grades/by-year**
- Get grades filtered by year/semester
- Query params: `?semester=1&year=2024`

**GET /api/grades/transcript**
- Get full academic transcript
- Headers: `Authorization: Bearer {token}`

### Courses Endpoints

**GET /api/courses**
- Get available courses
- Query params: `?semester=1`

**GET /api/courses/:courseId**
- Get course details

**GET /api/courses/enrolled**
- Get enrolled courses
- Headers: `Authorization: Bearer {token}`

### Enrollment Endpoints

**POST /api/enrollments**
- Register for course
- Headers: `Authorization: Bearer {token}`
- Body: `{ courseId }`

**DELETE /api/enrollments/:courseId**
- Drop course
- Headers: `Authorization: Bearer {token}`

### Fees Endpoints

**GET /api/fees**
- Get fee information
- Headers: `Authorization: Bearer {token}`

**GET /api/fees/invoice/:semester**
- Get semester invoice
- Headers: `Authorization: Bearer {token}`

### Payments Endpoints

**POST /api/payments**
- Initiate payment
- Headers: `Authorization: Bearer {token}`
- Body: `{ feeId, amount, paymentMethod }`

**POST /api/payments/confirm**
- Confirm payment completion
- Headers: `Authorization: Bearer {token}`
- Body: `{ paymentId, transactionId }`

**GET /api/payments/history**
- Get payment history
- Headers: `Authorization: Bearer {token}`

### Assignments Endpoints

**GET /api/assignments**
- Get all assignments for enrolled courses
- Headers: `Authorization: Bearer {token}`

**GET /api/assignments/:assignmentId**
- Get assignment details

**GET /api/assignments/course/:courseId**
- Get assignments for specific course

### Submissions Endpoints

**POST /api/submissions**
- Submit assignment
- Headers: `Authorization: Bearer {token}`
- Body: `{ assignmentId, fileUrl }`

**GET /api/submissions**
- Get all submissions
- Headers: `Authorization: Bearer {token}`

**GET /api/submissions/:submissionId**
- Get submission details
- Headers: `Authorization: Bearer {token}`

## Database Schema

The system includes 9 main tables:

1. **users** - User authentication
2. **students** - Student information
3. **courses** - Available courses
4. **enrollments** - Student course registrations
5. **grades** - Student grades and marks
6. **fees** - Student fee information
7. **payments** - Payment records
8. **assignments** - Course assignments
9. **submissions** - Assignment submissions

See `db/schema.sql` for complete schema details.

## Error Handling

All endpoints return consistent error format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Error details (development only)"
}
```

## Security Features

- Password hashing with bcrypt
- JWT authentication
- Protected routes with middleware
- Input validation
- CORS enabled

## Development Tips

- Use Postman or similar tool to test API endpoints
- Monitor logs with `npm run dev`
- Database queries use parameterized statements for SQL injection prevention

## Troubleshooting

**Database connection error:**
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Verify credentials

**Port already in use:**
- Change PORT in .env file
- Or kill process: `lsof -ti:5000 | xargs kill -9`

**JWT token expired:**
- Get new token using refresh endpoint
- Or re-login

## Next Steps

1. Seed test data into database
2. Set up payment gateway integration (Stripe/M-Pesa)
3. Configure email notifications
4. Set up admin panel for instructors
