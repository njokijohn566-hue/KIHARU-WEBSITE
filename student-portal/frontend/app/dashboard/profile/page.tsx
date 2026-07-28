'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { studentAPI } from '@/utils/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    city: '',
    country: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await studentAPI.getProfile();
        setProfile(response.data.data);
        setFormData({
          phone: response.data.data.phone || '',
          address: response.data.data.address || '',
          city: response.data.data.city || '',
          country: response.data.data.country || '',
        });
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await studentAPI.updateProfile(formData);
      setProfile(response.data.data);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">👤 My Profile</h1>

        {loading ? (
          <div className="text-center py-8">Loading profile...</div>
        ) : (
          <div className="max-w-2xl">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{profile?.first_name} {profile?.last_name}</h2>
                  <p className="text-gray-600">{profile?.email}</p>
                </div>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-gray-600 text-sm">Student ID</label>
                  <p className="text-lg font-semibold">{profile?.student_id}</p>
                </div>
                <div>
                  <label className="text-gray-600 text-sm">Current Semester</label>
                  <p className="text-lg font-semibold">{profile?.current_semester}</p>
                </div>
                <div>
                  <label className="text-gray-600 text-sm">Current GPA</label>
                  <p className="text-lg font-semibold">{profile?.gpa?.toFixed(2) || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600 text-sm">Enrollment Date</label>
                  <p className="text-lg font-semibold">{new Date(profile?.enrollment_date).toLocaleDateString()}</p>
                </div>
              </div>

              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-600 text-sm">Phone</label>
                    <p className="text-lg">{profile?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm">Address</label>
                    <p className="text-lg">{profile?.address || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm">City</label>
                    <p className="text-lg">{profile?.city || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm">Country</label>
                    <p className="text-lg">{profile?.country || 'Not provided'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
