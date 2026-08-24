'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/utils/api';
import toast from 'react-hot-toast';

interface Course {
  id: number;
  course_code: string;
  course_name: string;
  description: string | null;
  credits: number;
  semester: number;
  academic_year: string;
  capacity: number | null;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [semester, setSemester] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
const [saving, setSaving] = useState(false);

const [formData, setFormData] = useState({
  courseCode: '',
  courseName: '',
  description: '',
  credits: '',
  semester: '1',
  academicYear: '',
  capacity: '',
});

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const response = await adminAPI.getCourses();

      setCourses(response.data?.data?.courses || []);
    } catch (error: any) {
      console.error('Failed to fetch courses:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to load courses'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  const handleCreateCourse = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setSaving(true);

    await adminAPI.createCourse({
      courseCode: formData.courseCode,
      courseName: formData.courseName,
      description: formData.description,
      credits: Number(formData.credits),
      semester: Number(formData.semester),
      academicYear: formData.academicYear,
      capacity: formData.capacity
        ? Number(formData.capacity)
        : null,
    });

    toast.success('Course created successfully');

    setFormData({
      courseCode: '',
      courseName: '',
      description: '',
      credits: '',
      semester: '1',
      academicYear: '',
      capacity: '',
    });

    setShowAddForm(false);

    await fetchCourses();
  } catch (error: any) {
    console.error('Failed to create course:', error);

    toast.error(
      error.response?.data?.message ||
      'Failed to create course'
    );
  } finally {
    setSaving(false);
  }
};

const handleDeleteCourse = async (course: Course) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${course.course_name}" (${course.course_code})?\n\nThis action cannot be undone.`
  );

  if (!confirmed) {
    return;
  }

  try {
    await adminAPI.deleteCourse(course.id);

    toast.success('Course deleted successfully');

    await fetchCourses();
  } catch (error: any) {
    console.error('Failed to delete course:', error);

    toast.error(
      error.response?.data?.message ||
      'Failed to delete course'
    );
  }
};

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.course_code
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      course.course_name
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesSemester =
      !semester ||
      course.semester.toString() === semester;

    return matchesSearch && matchesSemester;
  });

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Courses
          </h1>

          <p className="mt-1 text-gray-500">
            Manage courses offered by the institution.
          </p>
        </div>

        <button
  onClick={() => setShowAddForm(true)}
  className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
>
  + Add Course
</button>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-xl p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Search by course code or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
          </select>

        </div>
      </div>

      {/* Course count */}
      <div className="mb-4 text-sm text-gray-500">
        Showing {filteredCourses.length} of {courses.length} courses
      </div>

      {/* Courses */}
      <div className="bg-white border rounded-xl overflow-hidden">

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading courses...
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No courses found.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Code
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Course
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Credits
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Semester
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Academic Year
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Capacity
                  </th>
                  
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                   Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">

                {filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-gray-50"
                  >

                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {course.course_code}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {course.course_name}
                      </div>

                      {course.description && (
                        <div className="text-sm text-gray-500 mt-1">
                          {course.description}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {course.credits}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      Semester {course.semester}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {course.academic_year}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {course.capacity ?? 'Unlimited'}
                    </td>

                    <td className="px-6 py-4">
  <button
    type="button"
    onClick={() => handleDeleteCourse(course)}
    className="px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
  >
    Delete
  </button>
</td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>  

      {/* Add Course Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Add Course
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Create a new course for the institution.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-900 text-2xl"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleCreateCourse}
              className="p-6 space-y-5"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Code
                  </label>

                  <input
                    type="text"
                    value={formData.courseCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        courseCode: e.target.value,
                      })
                    }
                    required
                    placeholder="e.g. PRG201"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Name
                  </label>

                  <input
                    type="text"
                    value={formData.courseName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        courseName: e.target.value,
                      })
                    }
                    required
                    placeholder="e.g. Advanced Programming"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Brief description of the course..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credits
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={formData.credits}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credits: e.target.value,
                      })
                    }
                    required
                    placeholder="e.g. 3"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester
                  </label>

                  <select
                    value={formData.semester}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        semester: e.target.value,
                      })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                    <option value="3">Semester 3</option>
                    <option value="4">Semester 4</option>
                    <option value="5">Semester 5</option>
                    <option value="6">Semester 6</option>
                  </select>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year
                  </label>

                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        academicYear: e.target.value,
                      })
                    }
                    required
                    placeholder="e.g. 2026/27"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacity: e.target.value,
                      })
                    }
                    placeholder="Leave empty for unlimited"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">

                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Create Course'}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}