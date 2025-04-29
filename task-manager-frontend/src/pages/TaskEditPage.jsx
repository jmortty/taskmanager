// TaskEditPage.jsx – Edit an existing task
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TaskEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', status: 'Pending' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`/api/v1/tasks/${id}`, { withCredentials: true });
        setForm(res.data.data);
      } catch (err) {
        setError('Failed to load task');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.put(`/api/v1/tasks/${id}`, form, { withCredentials: true });
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.error || 'Task update failed');
    }
  };

  if (loading) return <div className="text-center p-10 text-yellow-300">Loading task...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Edit Task</h1>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        {error && <p className="text-red-500">{error}</p>}

        <div>
          <label className="block mb-2">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-yellow-500"
          />
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-yellow-500"
          ></textarea>
        </div>

        <div>
          <label className="block mb-2">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-yellow-500"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded font-medium"
        >
          Update Task
        </button>
      </form>
    </div>
  );
};

export default TaskEditPage;