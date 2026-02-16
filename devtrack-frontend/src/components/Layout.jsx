import { Link, useNavigate, useLocation } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔐 Get role from token
  const token = localStorage.getItem("token");
  const decoded = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const role = decoded?.role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const linkClass = (path) =>
    `block px-4 py-3 rounded-md text-base font-medium transition ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col">

        {/* Logo */}
        <h1 className="text-2xl font-bold mb-10">
          DevTrack 🚀
        </h1>

        {/* Navigation Links */}
        <div className="space-y-6 flex-1">

          {/* 👑 ADMIN MENU */}
          {role === "admin" && (
            <>
              <Link to="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
              </Link>

              <Link to="/projects" className={linkClass("/projects")}>
                Projects
              </Link>

              <Link to="/tasks" className={linkClass("/tasks")}>
                Tasks
              </Link>

              <Link to="/developers" className={linkClass("/developers")}>
                Developers
              </Link>
            </>
          )}

          {/* 👨‍💻 DEVELOPER MENU */}
          {role === "developer" && (
            <>
              <Link to="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
              </Link>

              <Link to="/my-tasks" className={linkClass("/my-tasks")}>
                My Tasks
              </Link>
            </>
          )}

        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10">
        <div className="bg-white rounded-xl shadow-md p-8 min-h-[80vh]">
          {children}
        </div>
      </div>

    </div>
  );
}

export default Layout;