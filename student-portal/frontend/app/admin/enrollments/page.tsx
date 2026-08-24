'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/utils/api';
import toast from 'react-hot-toast';

interface Enrollment {
  id: number;
  registration_number: string;
  enrollment_date: string;
  status: string;

  student_record_id: number;
  student_id: string;

  first_name: string;
  last_name: string;
  email: string;

  course_id: number;
  course_code: string;
  course_name: string;
  credits: number;
  semester: number;
  academic_year: string;
}

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const fetchEnrollments = async () => {
    try {
      setLoading(true);

      const response = await adminAPI.getEnrollments();

      setEnrollments(
        response.data?.data?.enrollments || []
      );
    } catch (error: any) {
      console.error('Failed to fetch enrollments:', error);

      toast.error(
        error.response?.data?.message ||
          'Failed to load enrollments'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const filteredEnrollments = enrollments.filter(
    (enrollment) => {
      const searchTerm = search.toLowerCase();

      const matchesSearch =
        enrollment.student_id
          .toLowerCase()
          .includes(searchTerm) ||
        `${enrollment.first_name} ${enrollment.last_name}`
          .toLowerCase()
          .includes(searchTerm) ||
        enrollment.course_code
          .toLowerCase()
          .includes(searchTerm) ||
        enrollment.course_name
          .toLowerCase()
          .includes(searchTerm) ||
        enrollment.registration_number
          .toLowerCase()
          .includes(searchTerm);

      const matchesStatus =
        !status || enrollment.status === status;

      return matchesSearch && matchesStatus;
    }
  );

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Enrollments
        </h1>

        <p className="mt-1 text-gray-500">
          View and manage student course enrollments.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-xl p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Search student, course, or registration..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="dropped">Dropped</option>
          </select>

        </div>
      </div>

      {/* Count */}
      <div className="mb-4 text-sm text-gray-500">
        Showing {filteredEnrollments.length} of{' '}
        {enrollments.length} enrollments
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading enrollments...
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No enrollments found.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b">
                <tr>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Student
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Course
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Registration
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Semester
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Enrollment Date
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y">

                {filteredEnrollments.map(
                  (enrollment) => (
                    <tr
                      key={enrollment.id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {enrollment.first_name}{' '}
                          {enrollment.last_name}
                        </div>

                        <div className="text-sm text-gray-500">
                          {enrollment.student_id}
                        </div>

                        <div className="text-xs text-gray-400">
                          {enrollment.email}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {enrollment.course_code}
                        </div>

                        <div className="text-sm text-gray-500">
                          {enrollment.course_name}
                        </div>

                        <div className="text-xs text-gray-400">
                          {enrollment.credits} credits
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {enrollment.registration_number}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        Semester {enrollment.semester}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {enrollment.enrollment_date
                          ? new Date(
                              enrollment.enrollment_date
                            ).toLocaleDateString()
                          : '—'}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            enrollment.status ===
                            'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {enrollment.status}
                        </span>
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}