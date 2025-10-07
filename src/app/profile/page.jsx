import React from 'react';
import SubscriptionRequired from './SubscriptionRequired';
import { FaUser, FaEnvelope, FaStar, FaCheckCircle } from 'react-icons/fa';

const ProfileContent = ({ user, activeSub }) => {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">Premium Profile</h1>
      <p className="text-gray-700 mb-8">
        Welcome, <span className="font-semibold">{user?.name}</span>! You now have access to exclusive content, private deals, and premium features.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center space-x-4 p-4 bg-indigo-50 rounded-lg shadow-sm">
          <FaUser className="text-indigo-600 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <p className="font-medium text-gray-800">{user?.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-4 bg-indigo-50 rounded-lg shadow-sm">
          <FaEnvelope className="text-indigo-600 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-medium text-gray-800">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-4 bg-indigo-50 rounded-lg shadow-sm">
          <FaStar className="text-yellow-500 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">Current Plan</p>
            <p className="font-medium text-gray-800">{activeSub?.plan}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-4 bg-indigo-50 rounded-lg shadow-sm">
          <FaCheckCircle className="text-green-500 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">Subscription Status</p>
            <p className="font-medium text-gray-800">{activeSub?.status}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-indigo-100 rounded-lg text-gray-700 text-center font-medium">
        🎁 You have access to exclusive deals, content, and features!
      </div>
    </div>
  );
};

const ProfilePage = () => {
  return (
    <SubscriptionRequired>
      <ProfileContent
      />
    </SubscriptionRequired>
  );
};

export default ProfilePage;
