'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminAPI } from '@/utils/api';

interface Student {
  id: number;
  user_id: number;
  student_id: string;
  date_of_birth: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  enrollment_date: string;
  current_semester: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active?: boolean;
}

interface EditForm {
  firstName: string;
  lastName: string;
  email: string;
  studentIdNumber: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  currentSemester: number;
}

export default function StudentDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [form, setForm] = useState<EditForm>({
    firstName: '',
    lastName: '',
    email: '',
    studentIdNumber: '',
    dateOfBirth: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    currentSemester: 1,
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        setError('');

        const studentId = Number(params.studentId);

        const response = await adminAPI.getStudentById(studentId);
        const data = response.data?.data;

        if (!data) {
          setError('Student not found');
          return;
        }

        setStudent(data);

        setForm({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          email: data.email || '',
          studentIdNumber: data.student_id || '',
          dateOfBirth: data.date_of_birth
            ? new Date(data.date_of_birth).toISOString().split('T')[0]
            : '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          country: data.country || '',
          currentSemester: data.current_semester || 1,
        });
      } catch (err: any) {
        console.error('Failed to fetch student:', err);

        setError(
          err.response?.data?.message ||
            'Failed to load student details'
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.studentId) {
      fetchStudent();
    }
  }, [params.studentId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === 'currentSemester'
          ? Number(value)
          : value,
    }));
  };

  const handleSave = async () => {
    if (!student) return;

    try {
      setSaving(true);
      setError('');
      setMessage('');

      const response = await adminAPI.updateStudent(
        student.id,
        form
      );

      const updatedStudent = response.data?.data;

      if (updatedStudent) {
        setStudent((previous) => ({
          ...previous!,
          ...updatedStudent,
          email:
            updatedStudent.email ||
            form.email,
          first_name:
            updatedStudent.first_name ||
            form.firstName,
          last_name:
            updatedStudent.last_name ||
            form.lastName,
        }));
      }

      setEditing(false);
      setMessage('Student information updated successfully.');
    } catch (err: any) {
      console.error('Failed to update student:', err);

      setError(
        err.response?.data?.message ||
          'Failed to update student'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!student) return;

    setForm({
      firstName: student.first_name || '',
      lastName: student.last_name || '',
      email: student.email || '',
      studentIdNumber: student.student_id || '',
      dateOfBirth: student.date_of_birth
        ? new Date(student.date_of_birth)
            .toISOString()
            .split('T')[0]
        : '',
      phone: student.phone || '',
      address: student.address || '',
      city: student.city || '',
      country: student.country || '',
      currentSemester: student.current_semester || 1,
    });

    setEditing(false);
    setError('');
    setMessage('');
  };

  const handleStatusChange = async () => {
    if (!student) return;

    const currentlyActive = student.is_active !== false;

    const action = currentlyActive
      ? 'deactivate'
      : 'activate';

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this student?`
    );

    if (!confirmed) return;

    try {
      setChangingStatus(true);
      setError('');
      setMessage('');

      const response =
        await adminAPI.updateStudentStatus(
          student.id,
          !currentlyActive
        );

      const updatedStatus =
        response.data?.data?.is_active;

      setStudent((previous) =>
        previous
          ? {
              ...previous,
              is_active:
                updatedStatus !== undefined
                  ? updatedStatus
                  : !currentlyActive,
            }
          : previous
      );

      setMessage(
        `Student ${
          !currentlyActive
            ? 'activated'
            : 'deactivated'
        } successfully.`
      );
    } catch (err: any) {
      console.error(
        'Failed to change student status:',
        err
      );

      setError(
        err.response?.data?.message ||
          'Failed to change student status'
      );
    } finally {
      setChangingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-600">
          Loading student details...
        </p>
      </div>
    );
  }

  if (error && !student) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h1 className="text-xl font-semibold text-red-700">
            Unable to load student
          </h1>

          <p className="mt-2 text-red-600">
            {error}
          </p>

          <button
            onClick={() =>
              router.push('/admin/students')
            }
            className="mt-4 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  const isActive = student.is_active !== false;

  return (
    <div className="p-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <Link
            href="/admin/students"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← Back to Students
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mt-3">
            Student Profile
          </h1>

          <p className="text-gray-500 mt-1">
            View and manage student information.
          </p>
        </div>

        <div className="flex items-center gap-3">

          {!editing && (
            <button
              onClick={() => {
                setEditing(true);
                setMessage('');
                setError('');
              }}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit Student
            </button>
          )}

          <button
            onClick={handleStatusChange}
            disabled={changingStatus}
            className={`px-5 py-2.5 rounded-lg text-white transition ${
              isActive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            } disabled:opacity-50`}
          >
            {changingStatus
              ? 'Updating...'
              : isActive
              ? 'Deactivate'
              : 'Activate'}
          </button>

        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {message}
        </div>
      )}

      {error && student && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* Status */}
      <div className="mb-6">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isActive
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full mr-2 ${
              isActive
                ? 'bg-green-500'
                : 'bg-red-500'
            }`}
          />
          {isActive ? 'Active Student' : 'Inactive Student'}
        </span>
      </div>

      {/* Student Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">

        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Personal Information
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Student identification and contact information.
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="text-sm text-gray-500">
              First Name
            </label>

            {editing ? (
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            ) : (
              <p className="mt-1 font-semibold text-gray-900">
                {student.first_name}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Last Name
            </label>

            {editing ? (
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            ) : (
              <p className="mt-1 font-semibold text-gray-900">
                {student.last_name}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Email
            </label>

            {editing ? (
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            ) : (
              <p className="mt-1 font-semibold text-gray-900">
                {student.email}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Student ID
            </label>

            {editing ? (
              <input
                name="studentIdNumber"
                value={form.studentIdNumber}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            ) : (
              <p className="mt-1 font-semibold text-gray-900">
                {student.student_id}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Date of Birth
            </label>

            {editing ? (
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            ) : (
              <p className="mt-1 font-semibold text-gray-900">
                {student.date_of_birth
                  ? new Date(
                      student.date_of_birth
                    ).toLocaleDateString()
                  : '—'}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Phone
            </label>

            {editing ? (
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            ) : (
              <p className="mt-1 font-semibold text-gray-900">
                {student.phone || '—'}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Address
            </label>

            {editing ? (
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            ) : (
              <p className="mt-1 font-semibold text-gray-900">
                {student.address || '—'}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-500">
              City
            </label>

            {editing ? (
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            ) : (
              <p className="mt-1 font-semibold text-gray-900">
                {student.city || '—'}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Country
            </label>

            {editing ? (
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            ) : (
              <p className="mt-1 font-semibold text-gray-900">
                {student.country || '—'}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Current Semester
            </label>

            {editing ? (
              <select
                name="currentSemester"
                value={form.currentSemester}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {Array.from(
                  { length: 8 },
                  (_, index) => index + 1
                ).map((semester) => (
                  <option
                    key={semester}
                    value={semester}
                  >
                    Semester {semester}
                  </option>
                ))}
              </select>
            ) : (
              <p className="mt-1 font-semibold text-gray-900">
                Semester {student.current_semester}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Enrollment Date
            </label>

            <p className="mt-1 font-semibold text-gray-900">
              {student.enrollment_date
                ? new Date(
                    student.enrollment_date
                  ).toLocaleDateString()
                : '—'}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              User ID
            </label>

            <p className="mt-1 font-semibold text-gray-900">
              {student.user_id}
            </p>
          </div>

        </div>

        {/* Edit Actions */}
        {editing && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">

            <button
              onClick={handleCancel}
              disabled={saving}
              className="px-5 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

          </div>
        )}

      </div>

    </div>
  );
}