import { Outlet, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Layout() {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                DevTrack
              </Link>
              <div className="hidden md:flex space-x-1">
                <NavLink to="/">Dashboard</NavLink>
                <NavLink to="/projects">Projects</NavLink>
                <NavLink to="/tasks">All Tasks</NavLink>
                <NavLink to="/my-tasks">My Tasks</NavLink>
                <NavLink to="/developers">Developers</NavLink>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Animated page content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <Outlet />
      </motion.main>
    </div>
  )
}

// Helper component for active link styling
function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg text-sm font-medium transition ${
          isActive
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
        }`
      }
    >
      {children}
    </Link>
  )
}
