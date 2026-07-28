'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { assignmentAPI, submissionAPI } from '@/utils/api';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function AssignmentsPage() {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [tab, setTab] = useState('assignments');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentRes, submissionRes] = await Promise.all([
          assignmentAPI.getAll(),
          submissionAPI.getAll(),
        ]);
        setAssignments(assignmentRes.data.data.assignments);
        setSubmissions(submissionRes.data.data.submissions);
      } catch (error) {
        toast.error('Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatus = (assignment: any) => {
    const submission = submissions.find(s => s.assignment_id === assignment.id);
    if (!submission) return 'pending';
    if (new Date() > new Date(assignment.due_date)) return 'late';
    return 'submitted';
  };

  const handleSubmit = (assignmentId: number) => {
    toast.success('Opening file upload...');
    // In production, implement actual file upload
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">📝 Assignments</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab('assignments')}
            className={`px-6 py-2 rounded-lg font-medium ${
              tab === 'assignments'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Available Assignments
          </button>
          <button
            onClick={() => setTab('submissions')}
            className={`px-6 py-2 rounded-lg font-medium ${
              tab === 'submissions'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            My Submissions
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading assignments...</div>
        ) : (
          <>
            {tab === 'assignments' && (
              <div className="space-y-4">
                {assignments.length > 0 ? (
                  assignments.map((assignment) => {
                    const status = getStatus(assignment);
                    return (
                      <div key={assignment.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-bold">{assignment.title}</h3>
                            <p className="text-gray-600 text-sm">{assignment.course_name}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            status === 'submitted' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {status === 'pending' ? '⏳ Pending' :
                             status === 'submitted' ? '✅ Submitted' :
                             '⚠️ Late'}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 text-sm mb-3">{assignment.description}</p>
                        
                        <div className="flex justify-between items-center text-sm mb-3">
                          <span className="text-gray-600">
                            Due: {new Date(assignment.due_date).toLocaleDateString()} 
                            ({formatDistanceToNow(new Date(assignment.due_date), { addSuffix: true })})
                          </span>
                          <span className="text-gray-600">Max Score: {assignment.max_score}</span>
                        </div>

                        <button
                          onClick={() => handleSubmit(assignment.id)}
                          disabled={status === 'submitted'}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            status === 'submitted'
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          {status === 'submitted' ? 'Already Submitted' : 'Submit Assignment'}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">No assignments available</div>
                )}
              </div>
            )}

            {tab === 'submissions' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Assignment</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Submitted</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold">Status</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.length > 0 ? (
                      submissions.map((submission) => (
                        <tr key={submission.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium">{submission.title}</td>
                          <td className="px-6 py-4 text-sm">
                            {new Date(submission.submission_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-white text-sm ${
                              submission.status === 'submitted' ? 'bg-blue-500' :
                              submission.status === 'graded' ? 'bg-green-500' :
                              'bg-yellow-500'
                            }`}>
                              {submission.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-bold">
                            {submission.score ? `${submission.score}/${submission.max_score}` : '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          No submissions yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
