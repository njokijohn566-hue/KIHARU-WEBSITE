'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { coursesAPI, enrollmentAPI } from '@/utils/api';
import toast from 'react-hot-toast';

export default function UnitsPage() {
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState<any[]>([]);
  const [available, setAvailable] = useState<any[]>([]);
  const [tab, setTab] = useState('enrolled');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrolledRes, availableRes] = await Promise.all([
          coursesAPI.getEnrolled(),
          coursesAPI.getAvailable({ semester: 1 }),
        ]);
        setEnrolled(enrolledRes.data.data.enrollments);
        setAvailable(availableRes.data.data.courses);
      } catch (error) {
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRegister = async (courseId: number) => {
    try {
      await enrollmentAPI.register(courseId);
      toast.success('Course registered successfully!');
      // Refresh data
      const enrolledRes = await coursesAPI.getEnrolled();
      setEnrolled(enrolledRes.data.data.enrollments);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to register course');
    }
  };

  const handleDrop = async (courseId: number) => {
    if (window.confirm('Are you sure you want to drop this course?')) {
      try {
        await enrollmentAPI.drop(courseId);
        toast.success('Course dropped successfully!');
        const enrolledRes = await coursesAPI.getEnrolled();
        setEnrolled(enrolledRes.data.data.enrollments);
      } catch (error) {
        toast.error('Failed to drop course');
      }
    }
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">📚 Unit Registration</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab('enrolled')}
            className={`px-6 py-2 rounded-lg font-medium ${
              tab === 'enrolled'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Enrolled Courses ({enrolled.length})
          </button>
          <button
            onClick={() => setTab('available')}
            className={`px-6 py-2 rounded-lg font-medium ${
              tab === 'available'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Available Courses
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading courses...</div>
        ) : (
          <>
            {tab === 'enrolled' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Code</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Course Name</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold">Credits</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrolled.length > 0 ? (
                      enrolled.map((course) => (
                        <tr key={course.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium">{course.course_code}</td>
                          <td className="px-6 py-4 text-sm">{course.course_name}</td>
                          <td className="px-6 py-4 text-center text-sm">{course.credits}</td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleDrop(course.course_id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Drop
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          No enrolled courses
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'available' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {available.map((course) => (
                  <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold mb-2">{course.course_name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{course.course_code}</p>
                    <p className="text-gray-500 text-sm mb-4">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm"><strong>Credits:</strong> {course.credits}</span>
                      <button
                        onClick={() => handleRegister(course.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        Register
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
