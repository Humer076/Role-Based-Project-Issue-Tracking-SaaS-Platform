import { useEffect, useState } from "react";
import axios from "axios";

function Projects() {
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem("token");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/projects`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setProjects(res.data);
    } catch (err) {
      console.error("FETCH PROJECT ERROR:", err);
    }
  };

  return (
    <div>
      <h2>All Projects</h2>
      {projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        projects.map((project) => (
          <div key={project.id}>
            <strong>{project.name}</strong> — {project.description}
          </div>
        ))
      )}
    </div>
  );
}

export default Projects;