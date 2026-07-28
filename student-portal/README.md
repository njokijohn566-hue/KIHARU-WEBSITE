# Student Portal Web Application

A modern, production-ready Student Portal Web Application built with Next.js, Express, and PostgreSQL.

## 🎯 Features

- **Authentication**: JWT-based secure authentication
- **Grades Module**: View grades, CAT marks, exam marks, and GPA
- **Unit Registration**: Register/drop courses with prerequisite validation
- **Fees Payment**: Track fees, payments, and download receipts
- **Assignment Submission**: Submit assignments with deadline tracking
- **Role-Based Access Control**: Student-only access to own data

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + TypeScript + TailwindCSS
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL 15
- **Authentication**: JWT (JSON Web Tokens)
- **Containerization**: Docker & Docker Compose

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)

### Using Docker Compose (Recommended)

```bash
# Clone and navigate to project
cd student-portal

# Start all services
docker-compose up -d

# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api
# Database: localhost:5432
```

### Local Development

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
student-portal/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── utils/
│   ├── migrations/
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── app/
│   ├── components/
│   ├── utils/
│   ├── package.json
│   └── Dockerfile
├── db/
│   └── schema.sql
└── docker-compose.yml
```

## 📊 Database Schema

### Core Tables
- **users**: User accounts with authentication
- **students**: Student-specific information
- **courses**: Available courses
- **enrollments**: Course registrations
- **grades**: Student grades and marks
- **fees**: Fee information per semester
- **payments**: Payment history
- **assignments**: Course assignments
- **submissions**: Assignment submissions

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Login student
- `POST /api/auth/refresh` - Refresh JWT token

### Student
- `GET /api/students/me` - Get current student info
- `PUT /api/students/profile` - Update profile

### Grades
- `GET /api/grades` - Get all grades
- `GET /api/grades/:courseId` - Get course grades
- `GET /api/grades/transcript` - Download transcript

### Courses & Registration
- `GET /api/courses` - Get available courses
- `GET /api/enrollments` - Get enrolled courses
- `POST /api/enrollments` - Register course
- `DELETE /api/enrollments/:courseId` - Drop course

### Fees
- `GET /api/fees` - Get fee information
- `GET /api/payments` - Get payment history
- `POST /api/payments` - Make payment
- `GET /api/invoices/:semester` - Get semester invoice

### Assignments
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/:courseId` - Get course assignments
- `POST /api/submissions` - Submit assignment
- `GET /api/submissions` - Get submission history

## 🔑 Default Credentials (For Testing)

Username: `student@example.com`
Password: `password123`

⚠️ Change these in production!

## 📝 Environment Variables

See `.env.example` and update accordingly:

```bash
cp .env.example .env
# Edit .env with your configuration
```

## 🐛 Debugging

### View logs
```bash
# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Local development
npm run dev
```

### Database access
```bash
# Connect to PostgreSQL
psql postgresql://student_user:secure_password_change_me@localhost:5432/student_portal
```

## 📦 Deployment

### Production Build
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Setup
- Update `.env` with production credentials
- Set `NODE_ENV=production`
- Update `JWT_SECRET` with a strong random key
- Configure database credentials
- Set up SSL certificates

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 📚 Documentation

- [Backend API Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [Database Schema](./db/schema.sql)

## 🤝 Contributing

1. Create a feature branch
2. Commit changes
3. Push to branch
4. Create Pull Request

## 📄 License

MIT License - Feel free to use this project

## 🆘 Support

For issues and questions, please create an issue in the repository.
