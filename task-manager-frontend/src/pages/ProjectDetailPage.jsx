import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getProjectById,
  deleteProject as deleteProjectApi,
  addProjectMember as addProjectMemberApi,
  removeProjectMember as removeProjectMemberApi,
} from '../api/projects';
import { getTasks as fetchTasksApi } from '../api/tasks';
import TaskItem from '../components/TaskItem';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberInput, setNewMemberInput] = useState('');
  const [addMemberError, setAddMemberError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectData = await getProjectById(id);
        setProject(projectData);

        const ownerId = projectData.owner._id;
        const currentUserId = user?._id;
        const memberIds = projectData.members.map((m) => m._id);

        setIsOwner(currentUserId === ownerId);
        setIsMember(memberIds.includes(currentUserId));

        const taskData = await fetchTasksApi({ project: id });
        setTasks(taskData);
      } catch (err) {
        setError(err.error || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchData();
    }
  }, [authLoading, id, user]);

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProjectApi(id);
      navigate('/projects');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberInput.trim()) {
      setAddMemberError('Enter a valid user ID or email.');
      return;
    }
    try {
      await addProjectMemberApi(id, newMemberInput.trim());
      const updated = await getProjectById(id);
      setProject(updated);
      setNewMemberInput('');
      setShowAddMemberModal(false);
    } catch (err) {
      setAddMemberError(err.error || 'Could not add member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Remove this member?')) {
      await removeProjectMemberApi(id, memberId);
      const updated = await getProjectById(id);
      setProject(updated);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
        <div className="text-white text-lg font-semibold">Loading project...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-red-100 text-red-700 font-semibold">
        {error}
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-700 font-medium">
        Project not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-indigo-100 to-purple-100 p-6">
      {/* Project Header */}
      <div className="bg-white shadow rounded-xl p-6 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
          <p className="text-gray-600">{project.description || 'No description provided.'}</p>
        </div>
        {isOwner && (
          <div className="space-x-3">
            <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
              Edit
            </button>
            <button
              onClick={handleDeleteProject}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Members */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Members</h2>
          {isOwner && (
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              + Add Member
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-indigo-100">
              <tr>
                <th className="py-2 px-4 text-left">Username</th>
                <th className="py-2 px-4 text-left">Email</th>
                {isOwner && <th className="py-2 px-4 text-left">Action</th>}
              </tr>
            </thead>
            <tbody>
              {project.members.map((member) => (
                <tr key={member._id} className="border-b">
                  <td className="py-2 px-4">{member.username}</td>
                  <td className="py-2 px-4">{member.email}</td>
                  {isOwner && (
                    <td className="py-2 px-4">
                      {member._id !== user._id && (
                        <button
                          onClick={() => handleRemoveMember(member._id)}
                          className="text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tasks */}
      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Tasks</h2>
          {(isOwner || isMember) && (
            <Link
              to={`/projects/${id}/tasks/create`}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              + New Task
            </Link>
          )}
        </div>
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet.</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskItem key={task._id} task={task} />
            ))}
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold text-center mb-4">Add Member</h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <input
                type="text"
                value={newMemberInput}
                onChange={(e) => setNewMemberInput(e.target.value)}
                placeholder="Enter User ID or Email"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {addMemberError && (
                <p className="text-sm text-red-500">{addMemberError}</p>
              )}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMemberModal(false);
                    setNewMemberInput('');
                    setAddMemberError(null);
                  }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
