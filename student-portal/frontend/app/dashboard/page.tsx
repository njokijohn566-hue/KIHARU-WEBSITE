'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { studentAPI, gradesAPI, coursesAPI, feesAPI, assignmentAPI } from '@/utils/api';
import { BookOpen, DollarSign, FileText, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    gpa: 0,
    feeBalance: 0,
    assignments: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [coursesRes, gradesRes, feesRes, assignmentRes] = await Promise.all([
          coursesAPI.getEnrolled(),
          gradesAPI.getAll(),
          feesAPI.getInfo(),
          assignmentAPI.getAll(),
        ]);

        setStats({
          enrolledCourses: coursesRes.data.data.count,
          gpa: parseFloat(gradesRes.data.data.gpa),
          feeBalance: feesRes.data.data.totalBalance,
          assignments: assignmentRes.data.data.count,
        });
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    {
      title: 'Enrolled Courses',
      value: stats.enrolledCourses,
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      title: 'Current GPA',
      value: stats.gpa.toFixed(2),
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Fee Balance',
      value: `Ksh ${stats.feeBalance.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
    {
      title: 'Pending Assignments',
      value: stats.assignments,
      icon: FileText,
      color: 'bg-red-500',
    },
  ];

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="bg-white rounded-lg shadow-md p-6">
                  <div className={`${card.color} text-white rounded-lg p-3 w-12 mb-4`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium">{card.title}</h3>
                  <p className="text-2xl font-bold mt-2">{card.value}</p>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <a href="/dashboard/units" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors">
                📚 Register Units
              </a>
              <a href="/dashboard/grades" className="block p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-600 transition-colors">
                📊 View Grades
              </a>
              <a href="/dashboard/fees" className="block p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-yellow-600 transition-colors">
                💰 Pay Fees
              </a>
              <a href="/dashboard/assignments" className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-600 transition-colors">
                📝 Submit Assignments
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">Academic Calendar</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b">
                <span>Registration Period</span>
                <span className="font-semibold">Jan 15 - Feb 10</span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span>Semester 1</span>
                <span className="font-semibold">Feb 15 - May 30</span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span>Exam 1</span>
                <span className="font-semibold">Jun 1 - Jun 15</span>
              </div>
              <div className="flex justify-between pb-2">
                <span>Semester 2</span>
                <span className="font-semibold">Aug 1 - Nov 30</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
