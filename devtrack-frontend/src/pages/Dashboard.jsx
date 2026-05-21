import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, issues: 0, users: 0 });
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const [statsRes, issuesRes] = await Promise.all([
          axios.get(`${API}/api/stats`, { headers }),
          axios.get(`${API}/api/issues/recent`, { headers })
        ]);
        setStats(statsRes.data);
        setRecentIssues(issuesRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-gray-500 text-sm uppercase">Total Projects</h3>
          <p className="text-3xl font-bold mt-2">{stats.projects}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-gray-500 text-sm uppercase">Open Issues</h3>
          <p className="text-3xl font-bold mt-2">{stats.issues}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-gray-500 text-sm uppercase">Team Members</h3>
          <p className="text-3xl font-bold mt-2">{stats.users}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Issues</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Title</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Priority</th>
               </tr>
            </thead>
            <tbody>
              {recentIssues.map(issue => (
                <tr key={issue.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{issue.title}</td>
                  <td><span className={`px-2 py-1 rounded-full text-xs ${issue.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{issue.status}</span></td>
                  <td className="capitalize">{issue.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
