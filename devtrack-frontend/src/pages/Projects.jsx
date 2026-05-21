import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token')
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
    fetchProjects()
  }, [])

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
        <button className="btn-primary">+ New Project</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Link to={`/projects/${project.id}`} key={project.id}>
            <motion.div whileHover={{ y: -4 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer">
              <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
              <p className="text-gray-500 text-sm line-clamp-2">{project.description || 'No description'}</p>
              <div className="mt-4 flex justify-between text-sm text-gray-400">
                <span>📅 {new Date(project.created_at).toLocaleDateString()}</span>
                <span className="capitalize">● {project.status || 'active'}</span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}
