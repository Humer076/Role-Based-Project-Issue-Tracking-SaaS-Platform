import { Outlet, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Layout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                DevTrack
              </Link>
              <div className="hidden md:flex ml-10 space-x-4">
                <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md transition">Dashboard</Link>
                <Link to="/projects" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md transition">Projects</Link>
                <Link to="/tasks" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md transition">All Tasks</Link>
                <Link to="/my-tasks" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md transition">My Tasks</Link>
                <Link to="/developers" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md transition">Developers</Link>
              </div>
            </div>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-800 px-3 py-2 rounded-md transition">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main content with fade-in animation */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
