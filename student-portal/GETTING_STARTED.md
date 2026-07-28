# GETTING STARTED GUIDE - Student Portal 🎓

This guide will help you set up and run the complete Student Portal application.

## 📋 System Requirements

- **Node.js**: 18 or higher
- **Docker & Docker Compose**: For containerized setup (recommended)
- **PostgreSQL**: 15+ (if running locally without Docker)
- **Git**: For version control
- **2GB RAM minimum**: For running all services

## 🚀 Quick Start (Docker - Recommended)

### Step 1: Navigate to Project Root

```bash
cd student-portal
```

### Step 2: Start All Services

```bash
docker-compose up -d
```

This will:
- Start PostgreSQL database (port 5432)
- Build and start Backend API (port 5000)
- Build and start Frontend (port 3000)
- Initialize database schema

### Step 3: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Database**: localhost:5432

### Step 4: Login

Use the demo credentials:
```
Email: student@example.com
Password: password123
```

### Step 5: Stop Services

```bash
docker-compose down
```

---

## 🏗️ Local Development Setup

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Update .env with your database credentials
# DATABASE_URL=postgresql://student_user:password@localhost:5432/student_portal

# 5. Ensure PostgreSQL is running locally, then start backend
npm run dev
```

Backend runs on: **http://localhost:5000**

### Frontend Setup

```bash
# 1. Navigate to frontend (in another terminal)
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# 4. Start frontend
npm run dev
```

Frontend runs on: **http://localhost:3000**

---

## 📊 Database Setup

### Using Docker Compose (Automatic)

The database is automatically initialized when you run:
```bash
docker-compose up -d
```

### Manual Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE student_portal;
CREATE USER student_user WITH PASSWORD 'secure_password_change_me';
GRANT ALL PRIVILEGES ON DATABASE student_portal TO student_user;

# Exit psql
\q

# Run schema
psql -U student_user -d student_portal -f db/schema.sql
```

---

## 📁 Project Structure

```
student-portal/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   ├── models/           # Database queries
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # Auth, logging, etc.
│   │   ├── utils/            # Helpers (JWT, DB)
│   │   └── server.js         # Main server file
│   ├── migrations/           # Database migrations
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── app/                  # Next.js pages
│   │   ├── dashboard/        # Student portal pages
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── components/           # React components
│   ├── utils/                # API client, stores
│   ├── public/               # Static assets
│   ├── package.json
│   └── Dockerfile
│
├── db/
│   └── schema.sql            # Database schema
│
├── docker-compose.yml        # Docker configuration
└── README.md
```

---

## 🔐 Authentication

The system uses **JWT (JSON Web Tokens)** for authentication.

### Login Flow

1. Student visits `/login`
2. Enters email and password
3. Backend validates credentials
4. Returns JWT token
5. Frontend stores token in localStorage
6. Token automatically added to API requests
7. Redirected to dashboard

### Default Test Account

```
Email: student@example.com
Password: password123
```

---

## 📚 Core Features

### 1. **Grades** 📊
- View course grades (CAT, Exam, Final)
- Track GPA
- Download transcript
- Filter by semester

### 2. **Unit Registration** 📝
- View available courses
- Register for courses
- Drop courses (within registration period)
- Check credit limits (max 24 credits/semester)

### 3. **Fees** 💰
- View fee balance
- Track payments
- Download invoices
- Payment history

### 4. **Assignments** 📤
- View pending assignments
- Submit assignments
- Track submission status
- View grades

### 5. **Profile** 👤
- Edit personal information
- Update contact details
- View enrollment status

---

## 🔧 Configuration

### Environment Variables

**Backend** (`.env` file):
```env
NODE_ENV=development
DATABASE_URL=postgresql://student_user:password@localhost:5432/student_portal
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
PORT=5000
CLIENT_URL=http://localhost:3000
```

**Frontend** (`.env.local` file):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🧪 Testing the API

### Using Postman

1. Download and install Postman
2. Import collection: `student-portal.postman_collection.json`
3. Set environment variable: `base_url = http://localhost:5000/api`
4. Test endpoints

### Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"password123"}'

# Get grades (replace TOKEN)
curl -X GET http://localhost:5000/api/grades \
  -H "Authorization: Bearer TOKEN"
```

---

## 📈 Scaling & Deployment

### Production Checklist

- [ ] Update `.env` with strong JWT_SECRET
- [ ] Configure database for production
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Performance testing
- [ ] Security audit

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Deployment Platforms

- **Frontend**: Vercel, Netlify, AWS Amplify
- **Backend**: Heroku, Railway, DigitalOcean, AWS
- **Database**: AWS RDS, DigitalOcean Managed, Heroku Postgres

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process on port
lsof -i :3000  # Frontend
lsof -i :5000  # Backend
lsof -i :5432  # Database

# Kill process
kill -9 <PID>
```

### Database Connection Error

```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1;"

# Verify connection string
echo $DATABASE_URL
```

### API CORS Errors

- Ensure backend is running
- Check NEXT_PUBLIC_API_URL is correct
- Verify CORS is enabled in server.js

### Docker Issues

```bash
# View logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild images
docker-compose build --no-cache

# Remove all containers
docker-compose down -v
```

---

## 📞 Support & Resources

- **Documentation**: See README.md files in frontend/ and backend/
- **API Docs**: Full endpoint documentation in backend/README.md
- **Issues**: Check GitHub issues or project documentation

---

## 🎯 Next Steps

1. ✅ Start the application
2. ✅ Test with demo credentials
3. ✅ Explore all features
4. ✅ Customize for your institution
5. ✅ Deploy to production

---

## 📄 License

MIT License - Feel free to use and modify

---

## 🙋 Questions?

Refer to:
- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`
- Main README: `README.md`

Happy learning! 🚀
