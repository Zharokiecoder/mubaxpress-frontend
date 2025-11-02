import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import SimpleImageUpload from '../components/SimpleImageUpload';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    university: user?.university || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || ''
    },
    profileImage: user?.profileImage || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      phoneNumber: user?.phoneNumber || '',
      university: user?.university || '',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || ''
      },
      profileImage: user?.profileImage || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-700"></div>
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-16">
              <div className="flex items-end">
                <img
                  src={formData.profileImage ? `http://localhost:5000${formData.profileImage}` : 'https://via.placeholder.com/150'}
                  alt={user?.fullName}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <div className="ml-4 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.fullName}</h1>
                  <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                  <div className="mt-1">
                    <span className="inline-block bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-semibold">
                      {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary flex items-center mb-2"
                >
                  <FiEdit2 className="mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h2>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profile Picture
                </label>
                <SimpleImageUpload 
                  image={formData.profileImage}
                  setImage={(newImage) => setFormData(prev => ({ ...prev, profileImage: newImage }))}
                  label="Upload Profile Picture"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  University
                </label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Street Address"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="City"
                    />
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="State"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center disabled:opacity-50"
                >
                  <FiSave className="mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary flex items-center"
                >
                  <FiX className="mr-2" />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                    <FiUser className="mr-2" />
                    <span className="text-sm font-medium">Full Name</span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-semibold">{user?.fullName}</p>
                </div>

                <div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                    <FiMail className="mr-2" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-semibold">{user?.email}</p>
                </div>

                <div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                    <FiPhone className="mr-2" />
                    <span className="text-sm font-medium">Phone Number</span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-semibold">{user?.phoneNumber}</p>
                </div>

                <div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                    <FiMapPin className="mr-2" />
                    <span className="text-sm font-medium">University</span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-semibold">{user?.university}</p>
                </div>
              </div>

              {user?.role === 'student' && user?.studentId && (
                <div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                    <FiUser className="mr-2" />
                    <span className="text-sm font-medium">Student ID</span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-semibold">{user?.studentId}</p>
                </div>
              )}

              <div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                  <FiMapPin className="mr-2" />
                  <span className="text-sm font-medium">Address</span>
                </div>
                <p className="text-gray-900 dark:text-white font-semibold">
                  {user?.address?.street && `${user.address.street}, `}
                  {user?.address?.city && `${user.address.city}, `}
                  {user?.address?.state || 'Not provided'}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Account Status</p>
                    <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      {user?.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Verification</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {user?.isVerified ? 'Verified' : 'Pending'}
                    </p>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rating</p>
                    <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                      {user?.rating?.toFixed(1) || '0.0'} ⭐
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Account Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Account Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Member Since:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {new Date(user?.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Last Login:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {user?.lastLogin 
                  ? new Date(user.lastLogin).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'N/A'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Account Type:</span>
              <span className="font-semibold text-gray-900 dark:text-white capitalize">{user?.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;