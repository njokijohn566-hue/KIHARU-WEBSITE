'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/utils/api';

interface Student {
  id: number;
  student_id: string;
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  current_semester: number;
  is_active: boolean;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);

        const response = await adminAPI.getStudents();

        setStudents(response.data?.data?.students || []);
      } catch (err: any) {
        console.error('Failed to fetch students:', err);

        setError(
          err.response?.data?.message ||
          'Failed to load students'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchTerm = search.toLowerCase().trim();

      const matchesSearch =
        !searchTerm ||
        student.student_id.toLowerCase().includes(searchTerm) ||
        student.first_name.toLowerCase().includes(searchTerm) ||
        student.last_name.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm);

      const matchesSemester =
        semesterFilter === 'all' ||
        student.current_semester.toString() === semesterFilter;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && student.is_active) ||
        (statusFilter === 'inactive' && !student.is_active);

      return (
        matchesSearch &&
        matchesSemester &&
        matchesStatus
      );
    });
  }, [
    students,
    search,
    semesterFilter,
    statusFilter,
  ]);

  const clearFilters = () => {
    setSearch('');
    setSemesterFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <p className="text-sm text-gray-500">
            Administration
          </p>

          <h1 className="text-3xl font-bold text-gray-900">
            Students
          </h1>

          <p className="mt-2 text-gray-600">
            View and manage registered students.
          </p>
        </div>

        <div className="bg-white rounded-lg border px-5 py-3">
          <p className="text-sm text-gray-500">
            Showing
          </p>

          <p className="text-2xl font-bold text-gray-900">
            {loading ? '...' : filteredStudents.length}
          </p>

          <p className="text-xs text-gray-500">
            of {students.length} students
          </p>
        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, ID or email..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Semester */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>

              <select
                value={semesterFilter}
                onChange={(e) =>
                  setSemesterFilter(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">
                  All Semesters
                </option>

                <option value="1">
                  Semester 1
                </option>

                <option value="2">
                  Semester 2
                </option>

                <option value="3">
                  Semester 3
                </option>

                <option value="4">
                  Semester 4
                </option>

                <option value="5">
                  Semester 5
                </option>

                <option value="6">
                  Semester 6
                </option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">
                  All Students
                </option>

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>

          </div>

          {/* Clear */}
          {(search ||
            semesterFilter !== 'all' ||
            statusFilter !== 'all') && (
            <div className="mt-4">

              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>

            </div>
          )}

        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-500">
            Loading students...
          </p>
        </div>
      )}

      {/* Students table */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b">
                <tr>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Student ID
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Name
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Email
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Semester
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y">

                {filteredStudents.map((student) => (

                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 transition"
                  >

                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">
                        {student.student_id}
                      </span>
                    </td>

                    <td className="px-6 py-4">

                      <div>
                        <p className="font-medium text-gray-900">
                          {student.first_name}{' '}
                          {student.last_name}
                        </p>

                        <p className="text-sm text-gray-500">
                          User ID: {student.user_id}
                        </p>
                      </div>

                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {student.email}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      Semester {student.current_semester}
                    </td>

                    <td className="px-6 py-4">

                      {student.is_active ? (
                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                          Inactive
                        </span>
                      )}

                    </td>

                    <td className="px-6 py-4 text-right">

                      <Link
                        href={`/admin/students/${student.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        View
                      </Link>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* Empty filtered state */}
          {filteredStudents.length === 0 && (
            <div className="p-10 text-center">

              <p className="text-gray-500">
                No students match your filters.
              </p>

              <button
                onClick={clearFilters}
                className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>

            </div>
          )}

        </div>
      )}

    </div>
  );
}