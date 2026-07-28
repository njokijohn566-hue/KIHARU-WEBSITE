#!/bin/bash

# Seed data script for Student Portal

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌱 Seeding Student Portal Database...${NC}"

# Database connection
DB_USER="student_user"
DB_PASSWORD="secure_password_change_me"
DB_HOST="localhost"
DB_NAME="student_portal"

# Run SQL seed file
psql -U "$DB_USER" -d "$DB_NAME" -h "$DB_HOST" << EOF
-- Insert test users and students
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('student@example.com', '\$2b\$10\$YourHashedPasswordHere', 'John', 'Doe', 'student'),
('jane@example.com', '\$2b\$10\$AnotherHashedPassword', 'Jane', 'Smith', 'student'),
('instructor@example.com', '\$2b\$10\$InstructorHashedPass', 'Prof', 'Adams', 'instructor');

-- Get user IDs (these will be auto-generated)
-- Create students
INSERT INTO students (user_id, student_id, enrollment_date, current_semester) VALUES
(1, 'STU001', CURRENT_DATE, 1),
(2, 'STU002', CURRENT_DATE, 2);

-- Insert courses
INSERT INTO courses (course_code, course_name, description, credits, semester, academic_year) VALUES
('CS101', 'Introduction to Computer Science', 'Fundamentals of programming and algorithms', 3, 1, '2024'),
('CS102', 'Data Structures', 'Learn arrays, linked lists, trees, and graphs', 4, 1, '2024'),
('CS201', 'Database Management Systems', 'SQL and relational database design', 3, 2, '2024'),
('MATH101', 'Calculus I', 'Limits, derivatives, and integration', 4, 1, '2024'),
('ENG101', 'English Communication', 'Academic writing and presentation skills', 2, 1, '2024'),
('BUS101', 'Business Economics', 'Microeconomics and macroeconomics principles', 3, 1, '2024');

-- Insert sample enrollments
INSERT INTO enrollments (student_id, course_id, status) VALUES
(1, 1, 'active'),
(1, 2, 'active'),
(1, 4, 'active'),
(2, 3, 'active'),
(2, 5, 'active');

-- Insert sample grades
INSERT INTO grades (enrollment_id, student_id, course_id, cat_mark, exam_mark, final_grade, letter_grade, published) VALUES
(1, 1, 1, 18, 72, 68.4, 'B', true),
(2, 1, 2, 20, 68, 70.4, 'B', true),
(3, 1, 4, 16, 60, 58.0, 'C', true);

-- Insert fees
INSERT INTO fees (student_id, semester, academic_year, total_amount, paid_amount, outstanding_balance, status) VALUES
(1, 1, '2024', 150000, 100000, 50000, 'partial'),
(1, 2, '2024', 150000, 0, 150000, 'pending'),
(2, 1, '2024', 150000, 150000, 0, 'paid');

-- Insert sample assignments
INSERT INTO assignments (course_id, title, description, due_date, max_score) VALUES
(1, 'Assignment 1: Hello World', 'Write your first program', NOW() + INTERVAL '7 days', 10),
(1, 'Assignment 2: Variables and Data Types', 'Practice using variables', NOW() + INTERVAL '14 days', 10),
(2, 'Lab 1: Array Implementation', 'Implement an array data structure', NOW() + INTERVAL '10 days', 15);

EOF

echo -e "${GREEN}✅ Database seeded successfully!${NC}"
echo -e "${BLUE}📊 Sample data created:${NC}"
echo "   - 2 test students"
echo "   - 6 courses"
echo "   - 5 enrollments"
echo "   - 3 grades"
echo "   - 3 fees records"
echo "   - 3 assignments"
