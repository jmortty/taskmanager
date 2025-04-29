import React from 'react';
import { Link } from 'react-router-dom';

const SidebarMenu = ({ onLogout }) => {
  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col p-5 space-y-6 min-h-screen">
      <div className="text-2xl font-bold text-yellow-400">My Dashboard</div>

      <nav className="flex flex-col space-y-4 text-lg">
        <Link to="/dashboard" className="hover:text-yellow-400 transition">Home</Link>
        <Link to="/projects" className="hover:text-yellow-400 transition">Projects</Link>
        <Link to="/tasks" className="hover:text-yellow-400 transition">Tasks</Link>
        <Link to="/labels" className="hover:text-yellow-400 transition">Labels</Link>
        <Link to="/profile" className="hover:text-yellow-400 transition">Profile</Link>

        <button
          onClick={onLogout}
          className="mt-auto py-2 bg-red-500 hover:bg-red-600 rounded text-center"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default SidebarMenu;
