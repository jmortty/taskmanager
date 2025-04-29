// TaskListPage.jsx – Lists all tasks for the logged-in user
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/api/v1/tasks', { withCredentials: true });
        setTasks(res.data.data);
      } catch (err) {
        setError('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <div className="text-center p-10 text-yellow-300">Loading tasks...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-400">My Tasks</h1>
        <Link
          to="/tasks/create"
          className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 rounded text-black font-medium"
        >
          + New Task
        </Link>
      </div>

      {!Array.isArray(tasks) || tasks.length === 0 ? (
        <p className="text-gray-300">No tasks found. Click "New Task" to get started.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-gray-800 p-5 rounded-lg shadow flex justify-between items-center hover:bg-gray-700 transition"
            >
              <div>
                <h2 className="text-xl font-semibold text-yellow-300">{task.title}</h2>
                <p className="text-gray-400 text-sm">{task.status} • {new Date(task.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-4">
                <Link
                  to={`/tasks/${task._id}`}
                  className="text-yellow-400 hover:underline"
                >
                  View
                </Link>
                <Link
                  to={`/tasks/${task._id}/edit`}
                  className="text-yellow-400 hover:underline"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskListPage;