import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProjects as fetchProjectsApi } from '../api/projects';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard'; // Prebuilt card component

const ProjectListPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!authLoading && user) {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchProjectsApi();
          setProjects(data);
        } catch (err) {
          setError(err.error || 'Failed to fetch projects');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProjects();
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 bg-red-50 font-semibold">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-indigo-100 to-purple-100 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 md:mb-0">My Projects</h1>
        {/* Add Project Button */}
        <Link
          to="/projects/create"
          className="px-6 py-3 bg-indigo-600 text-white text-lg rounded-full shadow hover:bg-indigo-700 transition duration-300"
        >
          + New Project
        </Link>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 text-xl mb-6">You have no projects yet.</p>
          <Link
            to="/projects/create"
            className="inline-block px-6 py-3 bg-green-500 text-white rounded-full shadow hover:bg-green-600 transition"
          >
            Create your First Project
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectListPage;
