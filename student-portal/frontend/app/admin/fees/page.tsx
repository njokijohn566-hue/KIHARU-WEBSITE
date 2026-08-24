'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/utils/api';
import toast from 'react-hot-toast';

interface Fee {
  id: number;
  student_number: string;
  first_name: string;
  last_name: string;
  email: string;

  semester: number;
  academic_year: string;
  total_amount: number;
  paid_amount: number;
  outstanding_balance: number;
  due_date: string | null;
  status: string;
}

export default function AdminFeesPage() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const fetchFees = async () => {
    try {
      setLoading(true);

      const response = await adminAPI.getFees();

      setFees(response.data?.data?.fees || []);
    } catch (error: any) {
      console.error('Failed to fetch fees:', error);

      toast.error(
        error.response?.data?.message ||
          'Failed to load fees'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const filteredFees = fees.filter((fee) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      fee.student_number
        .toLowerCase()
        .includes(searchTerm) ||
      `${fee.first_name} ${fee.last_name}`
        .toLowerCase()
        .includes(searchTerm) ||
      fee.email
        .toLowerCase()
        .includes(searchTerm);

    const matchesStatus =
      !status || fee.status === status;

    return matchesSearch && matchesStatus;
  });

  const formatAmount = (amount: number) =>
    `KSh ${Number(amount || 0).toLocaleString()}`;

  const totalOutstanding = filteredFees.reduce(
    (total, fee) =>
      total + Number(fee.outstanding_balance || 0),
    0
  );

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Fees
        </h1>

        <p className="mt-1 text-gray-500">
          View student fee balances and payment status.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        <div className="bg-white border rounded-xl p-6">
          <p className="text-sm text-gray-500">
            Total Records
          </p>

          <p className="text-3xl font-bold text-gray-900 mt-2">
            {filteredFees.length}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <p className="text-sm text-gray-500">
            Outstanding Balance
          </p>

          <p className="text-2xl font-bold text-gray-900 mt-2">
            {formatAmount(totalOutstanding)}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <p className="text-sm text-gray-500">
            Pending / Partial
          </p>

          <p className="text-3xl font-bold text-gray-900 mt-2">
            {
              filteredFees.filter(
                (fee) =>
                  fee.status === 'pending' ||
                  fee.status === 'partial'
              ).length
            }
          </p>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-white border rounded-xl p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Search student..."
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
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </select>

        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading fees...
          </div>
        ) : filteredFees.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No fee records found.
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
                    Semester
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Total
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Paid
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Outstanding
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Due Date
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y">

                {filteredFees.map((fee) => (
                  <tr
                    key={fee.id}
                    className="hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {fee.first_name} {fee.last_name}
                      </div>

                      <div className="text-sm text-gray-500">
                        {fee.student_number}
                      </div>

                      <div className="text-xs text-gray-400">
                        {fee.email}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      <div>
                        Semester {fee.semester}
                      </div>

                      <div className="text-xs text-gray-400">
                        {fee.academic_year}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {formatAmount(fee.total_amount)}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {formatAmount(fee.paid_amount)}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900">
                      {formatAmount(fee.outstanding_balance)}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {fee.due_date
                        ? new Date(
                            fee.due_date
                          ).toLocaleDateString()
                        : '—'}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          fee.status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : fee.status === 'partial'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {fee.status}
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