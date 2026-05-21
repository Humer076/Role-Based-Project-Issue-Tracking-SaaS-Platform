import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, issues: 0, users: 0 })
  const [recentIssues, setRecentIssues] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const [statsRes, issuesRes] = await Promise.all([
          axios.get(`${API}/api/stats`, { headers }).catch(() => ({ data: { projects: 0, issues: 0, users: 0 } })),
          axios.get(`${API}/api/issues/recent`, { headers }).catch(() => ({ data: [] }))
        ])
        setStats(statsRes.data)
        setRecentIssues(issuesRes.data)
      } catch (error) {
        console.error('Dashboard fetch error', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Total Projects" value={stats.projects} icon="📁" />
        <StatsCard title="Open Issues" value={stats.issues} icon="🐛" />
        <StatsCard title="Team Members" value={stats.users} icon="👥" />
      </div>

      {/* Recent issues table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">Recent Issues</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentIssues.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-400">No issues yet</td>
                </tr>
              ) : (
                recentIssues.map(issue => (
                  <tr key={issue.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-3 font-medium">{issue.title}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="px-6 py-3 capitalize">{issue.priority || 'Medium'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}

function StatsCard({ title, value, icon }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </motion.div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    open: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  }
  const className = styles[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>{status || 'Open'}</span>
}
