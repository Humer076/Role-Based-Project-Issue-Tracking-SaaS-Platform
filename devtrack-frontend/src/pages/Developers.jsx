import { useEffect, useState } from "react";
import axios from "axios";

function Developers() {
  const [developers, setDevelopers] = useState([]);
  const token = localStorage.getItem("token");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/users`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setDevelopers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>All Developers</h2>
      {developers.map((dev) => (
        <div key={dev.id}>
          <strong>{dev.name}</strong> — {dev.email}
        </div>
      ))}
    </div>
  );
}

export default Developers;