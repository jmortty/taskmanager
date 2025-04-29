// src/components/ProjectCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
    if (!project) return null; // Handle case where project data might be missing

    return (
        <Link
            to={`/projects/${project._id}`}
            className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 ease-in-out border border-gray-200"
        >
            <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">{project.name}</h3> {/* Added truncate */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description || 'No description provided.'}</p> {/* Added line-clamp-3 */}
            <div className="flex items-center text-gray-500 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-3-3H6a3 3 0 00-3 3v2h5M17 9h.01M7 9h.01M7 13h9.99M7 17h5" />
                </svg>
                {/* Ensure members array exists before accessing length */}
                <span>{project.members ? project.members.length : 0} Members</span>
            </div>
        </Link>
    );
};

export default ProjectCard;