import { useEffect, useState } from "react";
import axios from "axios";

function Projects() {
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/projects",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>All Projects</h2>
      {projects.map((project) => (
        <div key={project.id}>
          <strong>{project.name}</strong> — {project.description}
        </div>
      ))}
    </div>
  );
}

export default Projects;