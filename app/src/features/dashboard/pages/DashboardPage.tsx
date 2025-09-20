import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { setNotification } from '../../../store/features/notifications/notificationsSlice';
import DashboardOverview from '../components/DashboardOverview';
import DashboardReports from '../components/DashboardReports';
import DashboardPets from '../components/DashboardPets';
import DashboardProfile from '../components/DashboardProfile';
import DashboardSettings from '../components/DashboardSettings';

type DashboardSection = 'overview' | 'reports' | 'pets' | 'profile' | 'settings';

const DashboardPage: React.FC = () => {
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');

  useEffect(() => {
    const section = searchParams.get('section') as DashboardSection;
    if (section && ['overview', 'reports', 'pets', 'profile', 'settings'].includes(section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  useEffect(() => {
    dispatch(setNotification(null));
  }, [activeSection, dispatch]);

  const handleSectionChange = (section: DashboardSection) => {
    setActiveSection(section);
    navigate('/dashboard', { replace: true });
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
                    onClick={() => handleSectionChange('overview')}
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
                    onClick={() => handleSectionChange('reports')}
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
                    onClick={() => handleSectionChange('pets')}
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
                    onClick={() => handleSectionChange('profile')}
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
                    onClick={() => handleSectionChange('settings')}
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
