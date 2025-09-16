import React from 'react';

const DashboardPets: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Pets</h2>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          Register New Pet
        </button>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium">
            All Pets
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Dogs
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Cats
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No pets registered</h3>
        <p className="mt-1 text-sm text-gray-500">Register your first pet to get started.</p>
        <div className="mt-6">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Register Pet
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPets;
