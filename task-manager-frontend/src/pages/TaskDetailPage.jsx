// TaskDetailPage.jsx – View a single task in detail
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`/api/v1/tasks/${id}`, { withCredentials: true });
        setTask(res.data.data);
      } catch (err) {
        setError('Failed to load task');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/api/v1/tasks/${id}`, { withCredentials: true });
        navigate('/tasks');
      } catch (err) {
        setError('Delete failed');
      }
    }
  };

  if (loading) return <div className="text-center p-10 text-yellow-300">Loading task...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!task) return <div className="text-center p-10 text-gray-400">Task not found</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-yellow-400 mb-4">{task.title}</h1>
      <p className="text-gray-300 mb-2">Status: <span className="font-semibold text-yellow-300">{task.status}</span></p>
      <p className="text-gray-400 mb-6 whitespace-pre-line">{task.description || 'No description provided.'}</p>

      <div className="flex space-x-4">
        <Link
          to={`/tasks/${id}/edit`}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded font-medium"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium"
        >
          Delete
        </button>
        <Link
          to="/tasks"
          className="text-yellow-300 hover:underline ml-auto"
        >
          ← Back to Task List
        </Link>
      </div>
    </div>
  );
};

export default TaskDetailPage;