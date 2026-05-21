import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newProject, setNewProject] = useState({ name: '', description: '' })
  const [role, setRole] = useState('developer')
  const token = localStorage.getItem('token')

  useEffect(() => {
    const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null
    setRole(decoded?.role || 'developer')
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProjects(res.data)
    } catch (error) {
      console.error('Failed to load projects', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API}/api/projects`, newProject, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setShowModal(false)
      setNewProject({ name: '', description: '' })
      fetchProjects()
    } catch (err) {
      console.error('Create project error', err)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project? All tasks will be lost.')) {
      try {
        await axios.delete(`${API}/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        fetchProjects()
      } catch (err) {
        console.error('Delete error', err)
      }
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
        {(role === 'admin' || role === 'project_manager') && (
          <button onClick={() => setShowModal(true)} className="btn-primary">+ New Project</button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative">
            <Link to={`/projects/${project.id}`}>
              <h3 className="text-xl font-semibold mb-2 hover:text-blue-600">{project.name}</h3>
              <p className="text-gray-500 text-sm line-clamp-2">{project.description || 'No description'}</p>
              <div className="mt-4 flex justify-between text-sm text-gray-400">
                <span>📅 {new Date(project.created_at).toLocaleDateString()}</span>
                <span className="capitalize">● {project.status || 'active'}</span>
              </div>
            </Link>
            {role === 'admin' && (
              <button
                onClick={() => handleDelete(project.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                🗑️
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal for creating project */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">New Project</h2>
            <form onSubmit={handleCreate}>
              <input type="text" placeholder="Project Name" className="w-full border p-2 rounded mb-3" value={newProject.name} onChange={(e) => setNewProject({...newProject, name: e.target.value})} required />
              <textarea placeholder="Description" className="w-full border p-2 rounded mb-3" value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  )
}
