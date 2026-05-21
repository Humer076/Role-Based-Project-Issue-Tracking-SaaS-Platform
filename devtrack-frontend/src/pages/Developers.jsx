import { useEffect, useState } from "react";
import axios from "axios";

function Developers() {
  const [developers, setDevelopers] = useState([]);
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDevelopers(res.data.filter(u => u.role === 'developer'));
      } catch (err) {
        console.error(err);
      }
    };
    fetchDevelopers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Developers</h2>
      <div className="grid gap-3">
        {developers.map(dev => (
          <div key={dev.id} className="bg-white p-4 rounded shadow border">
            <strong>{dev.name}</strong> — {dev.email}
          </div>
        ))}
      </div>
    </div>
  );
}
export default Developers;
