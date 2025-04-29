// DashboardPage.jsx – Integrated with SidebarMenu
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import SidebarMenu from '../components/SidebarMenu';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <SidebarMenu onLogout={logout} />

      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-yellow-400">Dashboard</h1>
          <p className="text-gray-300 mt-1">Welcome, {user?.username || 'User'}!</p>
        </header>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-yellow-400">My Projects</h2>
            <p className="text-gray-300 mt-2">Manage your active projects efficiently.</p>
            <Link to="/projects" className="mt-4 inline-block text-yellow-300 hover:underline">
              View Projects
            </Link>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-yellow-400">Tasks</h2>
            <p className="text-gray-300 mt-2">Track your progress and get things done.</p>
            <Link to="/tasks" className="mt-4 inline-block text-yellow-300 hover:underline">
              Manage Tasks
            </Link>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-yellow-400">Profile</h2>
            <p className="text-gray-300 mt-2">Update your information and settings.</p>
            <Link to="/profile" className="mt-4 inline-block text-yellow-300 hover:underline">
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Recent Activities Table */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-yellow-400">Recent Activities</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-white">
              <thead>
                <tr className="bg-gray-700 text-yellow-300 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Activity</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-300 text-sm font-light">
                <tr className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-3 px-6 text-left">Created a new project</td>
                  <td className="py-3 px-6 text-left">April 28, 2025</td>
                  <td className="py-3 px-6 text-left">
                    <span className="bg-green-700 text-green-200 py-1 px-3 rounded-full text-xs">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-3 px-6 text-left">Updated profile settings</td>
                  <td className="py-3 px-6 text-left">April 27, 2025</td>
                  <td className="py-3 px-6 text-left">
                    <span className="bg-yellow-600 text-yellow-100 py-1 px-3 rounded-full text-xs">
                      Pending
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
