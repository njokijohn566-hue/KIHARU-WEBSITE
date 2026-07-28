'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { gradesAPI } from '@/utils/api';
import toast from 'react-hot-toast';

export default function GradesPage() {
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState<any[]>([]);
  const [gpa, setGPA] = useState(0);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await gradesAPI.getAll();
        setGrades(response.data.data.grades);
        setGPA(parseFloat(response.data.data.gpa));
      } catch (error) {
        toast.error('Failed to load grades');
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  const getLetterGrade = (score: number) => {
    if (score >= 70) return 'A';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    return 'D';
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">📊 Grades</h1>

        {loading ? (
          <div className="text-center py-8">Loading grades...</div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-bold mb-4">GPA Summary</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Current GPA</p>
                  <p className="text-3xl font-bold text-blue-600">{gpa.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Courses Graded</p>
                  <p className="text-3xl font-bold text-green-600">{grades.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Status</p>
                  <p className="text-2xl font-bold text-purple-600">{gpa >= 2 ? '✅ Pass' : '❌ At Risk'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Course Code</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Course Name</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">CAT</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Exam</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Final Grade</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Letter</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade) => (
                    <tr key={grade.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium">{grade.course_code}</td>
                      <td className="px-6 py-4 text-sm">{grade.course_name}</td>
                      <td className="px-6 py-4 text-center text-sm">{grade.cat_mark?.toFixed(1) || '-'}</td>
                      <td className="px-6 py-4 text-center text-sm">{grade.exam_mark?.toFixed(1) || '-'}</td>
                      <td className="px-6 py-4 text-center text-sm font-semibold">{grade.final_grade?.toFixed(1) || '-'}</td>
                      <td className="px-6 py-4 text-center text-sm">
                        <span className={`px-3 py-1 rounded-full text-white ${
                          grade.letter_grade === 'A' ? 'bg-green-500' :
                          grade.letter_grade === 'B' ? 'bg-blue-500' :
                          grade.letter_grade === 'C' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}>
                          {grade.letter_grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
