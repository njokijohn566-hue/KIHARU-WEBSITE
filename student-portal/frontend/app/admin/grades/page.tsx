'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/utils/api';
import toast from 'react-hot-toast';

interface Grade {
  id: number;
  student_number: string;
  first_name: string;
  last_name: string;
  email: string;

  course_code: string;
  course_name: string;
  credits: number;
  semester: number;
  academic_year: string;

  cat_mark: number | null;
  exam_mark: number | null;
  final_grade: number | null;
  letter_grade: string | null;
  gpa_points: number | null;
  remarks: string | null;
  published: boolean;
}

export default function AdminGradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [semester, setSemester] = useState('');
  const [published, setPublished] = useState('');

  const fetchGrades = async () => {
    try {
      setLoading(true);

      const response = await adminAPI.getGrades();

      setGrades(response.data?.data?.grades || []);
    } catch (error: any) {
      console.error('Failed to fetch grades:', error);

      toast.error(
        error.response?.data?.message ||
          'Failed to load grades'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const filteredGrades = grades.filter((grade) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      grade.student_number
        .toLowerCase()
        .includes(searchTerm) ||
      `${grade.first_name} ${grade.last_name}`
        .toLowerCase()
        .includes(searchTerm) ||
      grade.course_code
        .toLowerCase()
        .includes(searchTerm) ||
      grade.course_name
        .toLowerCase()
        .includes(searchTerm);

    const matchesSemester =
      !semester ||
      grade.semester.toString() === semester;

    const matchesPublished =
      published === '' ||
      grade.published.toString() === published;

    return (
      matchesSearch &&
      matchesSemester &&
      matchesPublished
    );
  });

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Grades
        </h1>

        <p className="mt-1 text-gray-500">
          View student academic results and grade records.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-xl p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="Search student or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
          </select>

          <select
            value={published}
            onChange={(e) => setPublished(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Results</option>
            <option value="true">Published</option>
            <option value="false">Unpublished</option>
          </select>

        </div>
      </div>

      {/* Count */}
      <div className="mb-4 text-sm text-gray-500">
        Showing {filteredGrades.length} of {grades.length} grade records
      </div>

      {/* Grades */}
      <div className="bg-white border rounded-xl overflow-hidden">

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading grades...
          </div>
        ) : filteredGrades.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No grade records found.
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
                    CAT
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Exam
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Final
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Grade
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    GPA
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y">

                {filteredGrades.map((grade) => (
                  <tr
                    key={grade.id}
                    className="hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {grade.first_name} {grade.last_name}
                      </div>

                      <div className="text-sm text-gray-500">
                        {grade.student_number}
                      </div>

                      <div className="text-xs text-gray-400">
                        {grade.email}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {grade.course_code}
                      </div>

                      <div className="text-sm text-gray-500">
                        {grade.course_name}
                      </div>

                      <div className="text-xs text-gray-400">
                        Semester {grade.semester} · {grade.credits} credits
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {grade.cat_mark ?? '—'}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {grade.exam_mark ?? '—'}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900">
                      {grade.final_grade ?? '—'}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        {grade.letter_grade ?? '—'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {grade.gpa_points ?? '—'}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          grade.published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {grade.published
                          ? 'Published'
                          : 'Unpublished'}
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}