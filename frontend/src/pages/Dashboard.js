import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tasks');
        setLoading(false);
      }
    };
    fetchTasks();
  }, [navigate]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/tasks`, { title }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks([res.data, ...tasks]);
      setTitle('');
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="netflix-header">
        <span className="netflix-logo">Task Manager</span>
        <button className="netflix-btn" onClick={handleLogout}>Logout</button>
      </div>
      <form onSubmit={handleAddTask}>
        <div className="form-group">
          <label>Add New Task</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Task title..." />
        </div>
        <button className="netflix-btn" type="submit">Add Task</button>
      </form>
      {error && <div style={{ color: '#e50914', marginBottom: '1rem' }}>{error}</div>}
      {loading ? <div>Loading...</div> : (
        <ul className="task-list">
          {tasks.map(task => (
            <li className="task-item" key={task._id}>
              <span className="task-title">{task.title}</span>
              <button className="netflix-btn" onClick={() => handleDelete(task._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
