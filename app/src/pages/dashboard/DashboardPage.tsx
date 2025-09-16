import React, { useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import DashboardOverview from '../../components/dashboard/DashboardOverview';
import DashboardReports from '../../components/dashboard/DashboardReports';
import DashboardPets from '../../components/dashboard/DashboardPets';
import DashboardProfile from '../../components/dashboard/DashboardProfile';
import DashboardSettings from '../../components/dashboard/DashboardSettings';

type DashboardSection = 'overview' | 'reports' | 'pets' | 'profile' | 'settings';

const DashboardPage: React.FC = () => {
  const user = useAppSelector(state => state.auth.user);
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview onNavigate={setActiveSection} />;
      case 'reports':
        return <DashboardReports />;
      case 'pets':
        return <DashboardPets />;
      case 'profile':
        return <DashboardProfile user={user} />;
      case 'settings':
        return <DashboardSettings />;
      default:
        return <DashboardOverview onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user?.email}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <nav className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveSection('overview')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === 'overview'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    Overview
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('reports')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === 'reports'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    My Reports
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('pets')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === 'pets'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    My Pets
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('profile')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === 'profile'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('settings')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === 'settings'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    Settings
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {renderSection()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
