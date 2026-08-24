'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/utils/authStore';
import { adminAPI } from '@/utils/api';

export default function AdminDashboard() {
  const router = useRouter();
  const { token, user, loadAuth } = useAuthStore();

  const [checking, setChecking] = useState(true);
  const [studentCount, setStudentCount] = useState(0);
  const [loadingStudents, setLoadingStudents] = useState(true);

  useEffect(() => {
    loadAuth();
    setChecking(false);
  }, [loadAuth]);

  useEffect(() => {
    if (checking) return;

    if (!token) {
      router.replace('/login');
      return;
    }

    if (user?.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [checking, token, user, router]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await adminAPI.getStudents();

        const students = response.data?.data?.students || [];

        setStudentCount(students.length);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setLoadingStudents(false);
      }
    };

    if (token && user?.role === 'admin') {
      fetchStudents();
    }
  }, [token, user]);

  if (checking || !token || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <p className="text-sm text-gray-500">
            Kiharu TVC
          </p>

          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Welcome back, {user.firstName || 'Administrator'}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Students */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Students
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              {loadingStudents ? '...' : studentCount}
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Registered students
            </p>
          </div>

          {/* Courses */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Courses
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              —
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Available courses
            </p>
          </div>

          {/* Enrollments */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Enrollments
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              —
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Active enrollments
            </p>
          </div>

          {/* Fees */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Pending Fees
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              —
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Outstanding payments
            </p>
          </div>

        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Administration
          </h2>

          <p className="text-gray-600 mt-2">
            Manage students, courses, enrollments, grades and fees
            from the administration portal.
          </p>
        </div>

      </div>
    </main>
  );
}