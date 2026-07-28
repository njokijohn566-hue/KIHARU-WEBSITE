'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { feesAPI, paymentsAPI } from '@/utils/api';
import toast from 'react-hot-toast';

export default function FeesPage() {
  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState<any[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [payments, setPayments] = useState<any[]>([]);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feesRes, paymentsRes] = await Promise.all([
          feesAPI.getInfo(),
          paymentsAPI.getHistory(),
        ]);
        setFees(feesRes.data.data.fees);
        setTotalBalance(feesRes.data.data.totalBalance);
        setPayments(paymentsRes.data.data.payments);
      } catch (error) {
        toast.error('Failed to load fee information');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePayment = (feeId: number, amount: number) => {
    toast.success('Redirecting to payment gateway...');
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">💰 Fees & Payments</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab('overview')}
            className={`px-6 py-2 rounded-lg font-medium ${
              tab === 'overview'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setTab('history')}
            className={`px-6 py-2 rounded-lg font-medium ${
              tab === 'history'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Payment History
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading fee information...</div>
        ) : (
          <>
            {tab === 'overview' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-gray-600 text-sm">Total Outstanding Balance</p>
                    <p className="text-3xl font-bold text-red-600">Ksh {totalBalance.toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-gray-600 text-sm">Semesters with Balance</p>
                    <p className="text-3xl font-bold text-orange-600">{fees.length}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-gray-600 text-sm">Status</p>
                    <p className="text-2xl font-bold">{totalBalance > 0 ? '⚠️ Outstanding' : '✅ Paid'}</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Semester</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Year</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold">Total</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold">Paid</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold">Balance</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fees.map((fee) => (
                        <tr key={fee.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">Semester {fee.semester}</td>
                          <td className="px-6 py-4 text-sm">{fee.academic_year}</td>
                          <td className="px-6 py-4 text-right text-sm">Ksh {fee.total_amount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-right text-sm text-green-600 font-medium">Ksh {fee.paid_amount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-right text-sm font-bold text-red-600">Ksh {fee.outstanding_balance.toLocaleString()}</td>
                          <td className="px-6 py-4 text-center">
                            {fee.outstanding_balance > 0 ? (
                              <button
                                onClick={() => handlePayment(fee.id, fee.outstanding_balance)}
                                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                              >
                                Pay
                              </button>
                            ) : (
                              <span className="text-green-600 text-sm">Paid ✓</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {tab === 'history' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Reference</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Method</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length > 0 ? (
                      payments.map((payment) => (
                        <tr key={payment.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">{payment.reference_number}</td>
                          <td className="px-6 py-4 text-sm font-medium">Ksh {payment.amount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm">{payment.payment_method}</td>
                          <td className="px-6 py-4 text-sm">{new Date(payment.payment_date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-white text-sm ${
                              payment.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          No payment history
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
