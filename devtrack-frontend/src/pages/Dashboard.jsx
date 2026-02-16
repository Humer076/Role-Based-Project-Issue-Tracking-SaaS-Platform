import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const decoded = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const userRole = decoded?.role;

  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: ""
  });

  const [devForm, setDevForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchProjects();
    if (userRole === "admin") {
      fetchDashboardStats();
    }
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/dashboard/stats",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setStats(res.data);
    } catch (error) {
      console.error("Dashboard stats error:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/projects",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setProjects(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch projects");
    }
  };

  const handleProjectChange = (e) => {
    setProjectForm({
      ...projectForm,
      [e.target.name]: e.target.value
    });
  };

  const createProject = async (e) => {
    e.preventDefault();

    if (!projectForm.name.trim() || !projectForm.description.trim()) {
      alert("Please enter both project name and description");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/projects",
        projectForm,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setProjectForm({ name: "", description: "" });
      fetchProjects();
      fetchDashboardStats();

    } catch (error) {
      alert(error.response?.data?.message || "Failed to create project");
    }
  };

  const handleDevChange = (e) => {
    setDevForm({
      ...devForm,
      [e.target.name]: e.target.value
    });
  };

  const createDeveloper = async (e) => {
    e.preventDefault();

    if (!devForm.name || !devForm.email || !devForm.password) {
      alert("All fields required");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/users",
        devForm,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Developer Created Successfully");

      setDevForm({
        name: "",
        email: "",
        password: ""
      });

      fetchDashboardStats();

    } catch (error) {
      alert(error.response?.data?.message || "Failed to create developer");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>DevTrack Dashboard 🚀</h1>

      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
        Logout
      </button>

      <hr />

      {userRole === "admin" && stats && (
        <>
          <h2>Dashboard Overview</h2>

          <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
            <StatCard
              title="Total Projects"
              value={stats.totalProjects}
              onClick={() => navigate("/projects")}
            />

            <StatCard
              title="Total Developers"
              value={stats.totalDevelopers}
              onClick={() => navigate("/developers")}
            />

            <StatCard
              title="Total Tasks"
              value={stats.totalTasks}
              onClick={() => navigate("/tasks")}
            />

            <StatCard
              title="Pending Tasks"
              value={stats.pendingTasks}
              onClick={() => navigate("/tasks?status=pending")}
            />

            <StatCard
              title="Completed Tasks"
              value={stats.completedTasks}
              onClick={() => navigate("/tasks?status=completed")}
            />
          </div>
        </>
      )}

      {userRole === "admin" && (
        <>
          <h2>Create Project</h2>

          <form onSubmit={createProject}>
            <input
              type="text"
              name="name"
              placeholder="Project Name"
              value={projectForm.name}
              onChange={handleProjectChange}
            />
            <br /><br />

            <input
              type="text"
              name="description"
              placeholder="Project Description"
              value={projectForm.description}
              onChange={handleProjectChange}
            />
            <br /><br />

            <button type="submit">Create Project</button>
          </form>

          <hr />

          <h2>Add Developer</h2>

          <form onSubmit={createDeveloper}>
            <input
              type="text"
              name="name"
              placeholder="Developer Name"
              value={devForm.name}
              onChange={handleDevChange}
            />
            <br /><br />

            <input
              type="email"
              name="email"
              placeholder="Developer Email"
              value={devForm.email}
              onChange={handleDevChange}
            />
            <br /><br />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={devForm.password}
              onChange={handleDevChange}
            />
            <br /><br />

            <button type="submit">Create Developer</button>
          </form>

          <hr />
        </>
      )}

      <h2>Your Projects</h2>

      {projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li
              key={project.id}
              style={{ cursor: "pointer", marginBottom: "10px" }}
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <strong>{project.name}</strong> — {project.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatCard({ title, value, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        minWidth: "160px",
        textAlign: "center",
        cursor: "pointer",
        transition: "0.2s"
      }}
    >
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

export default Dashboard;