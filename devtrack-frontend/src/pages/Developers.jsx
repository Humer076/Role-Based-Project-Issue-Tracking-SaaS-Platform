import { useEffect, useState } from "react";
import axios from "axios";

function Developers() {
  const [developers, setDevelopers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users",
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