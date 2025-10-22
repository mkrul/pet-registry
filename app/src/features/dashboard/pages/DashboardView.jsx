import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks.js';
import DashboardOverview from '../components/DashboardOverview';
import DashboardReports from '../components/DashboardReports';
import DashboardPets from '../components/DashboardPets';
import DashboardProfile from '../components/DashboardProfile';
import DashboardSettings from '../components/DashboardSettings';

const DashboardView = () => {
  const user = useAppSelector(state => state.auth.user);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialSection = () => {
    const pathParts = location.pathname.split('/');
    const section = pathParts[2];
    return section && ['overview', 'reports', 'pets', 'profile', 'settings'].includes(section) ? section : 'overview';
  };

  const [activeSection, setActiveSection] = useState(getInitialSection);

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const section = pathParts[2];
    if (section && ['overview', 'reports', 'pets', 'profile', 'settings'].includes(section)) {
      setActiveSection(section);
    }
  }, [location.pathname]);

  // Scroll to top when active section changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeSection]);

  // Scroll to top when component mounts (handles direct URL navigation)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSectionChange = (section) => {
    navigate(`/dashboard/${section}`);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview onNavigate={handleSectionChange} />;
      case 'reports':
        return <DashboardReports shouldCreateReport={searchParams.get('action') === 'create'} />;
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
    <div className="min-h-screen bg-page dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">User Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Welcome back, {user?.displayName || user?.email}!</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <nav className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleSectionChange('overview')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === 'overview'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    Overview
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSectionChange('reports')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === 'reports'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    My Reports
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSectionChange('pets')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === 'pets'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    My Pets
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSectionChange('profile')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === 'profile'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSectionChange('settings')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === 'settings'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    Settings
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          <main className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {renderSection()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
