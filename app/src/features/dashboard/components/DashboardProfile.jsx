import React, { useState } from 'react';
import { useUpdateUserMutation } from '../../../store/features/auth/authApiSlice';
import { normalizePhoneNumber, formatPhoneNumber, isValidPhoneNumber } from '../../../shared/utils/phoneUtils';

const DashboardProfile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
  const [email, setEmail] = useState(user?.email || '');
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const normalizedPhone = normalizePhoneNumber(phoneNumber);
      if (normalizedPhone && !isValidPhoneNumber(normalizedPhone)) {
        alert('Please enter a valid 10-digit phone number');
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
      }

      await updateUser({
        phone_number: normalizedPhone,
        email: email,
        display_name: displayName
      }).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancelClick = () => {
    setPhoneNumber(user?.phone_number || '');
    setEmail(user?.email || '');
    setDisplayName(user?.display_name || '');
    setIsEditing(false);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Allow only digits, spaces, parentheses, hyphens, and plus sign
    const cleaned = value.replace(/[^\d\s\(\)\-\+]/g, '');
    setPhoneNumber(cleaned);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleDisplayNameChange = (e) => {
    setDisplayName(e.target.value);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile</h2>

      <div className="max-w-2xl">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
              <p className="text-sm text-gray-500">Manage your account details and preferences</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              {isEditing ? (
                <input
                  id="email-address"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email address"
                />
              ) : (
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                  {user?.email || 'None'}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="display-name" className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
              {isEditing ? (
                <input
                  id="display-name"
                  type="text"
                  value={displayName}
                  onChange={handleDisplayNameChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your display name"
                />
              ) : (
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                  {user?.displayName || 'None'}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              {isEditing ? (
                <input
                  id="phone-number"
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={user?.phoneNumber ? formatPhoneNumber(user.phoneNumber) : "(XXX) XXX-XXXX"}
                />
              ) : (
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                  {user?.phoneNumber ? formatPhoneNumber(user.phoneNumber) : 'None'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
              <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'None'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex space-x-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveClick}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancelClick}
                    disabled={isLoading}
                    className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEditClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Change Password
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfile;
