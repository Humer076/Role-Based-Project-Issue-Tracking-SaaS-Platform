import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState("");

  const token = localStorage.getItem("token");
  const location = useLocation();

  const status = new URLSearchParams(location.search).get("status");

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    fetchTasks();
  }, [status]);

  const fetchTasks = async () => {
    try {
      const url = status
        ? `/api/tasks?status=${status}`
        : `/api/tasks`;

      const res = await api.get(url, authHeader);
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch tasks error:", err);
    }
  };

  // ✅ DELETE TASK
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`, authHeader);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Delete task error:", err);
    }
  };

  // ✅ EDIT TASK (Status Update)
  const handleEdit = async (id) => {
    try {
      const res = await api.put(
        `/api/tasks/${id}`,
        { status: editStatus },
        authHeader
      );

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? res.data : task
        )
      );

      setEditingId(null);
      setEditStatus("");
    } catch (err) {
      console.error("Edit task error:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        Tasks {status && `- ${status}`}
      </h2>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            {editingId === task.id ? (
              <>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="border p-2 rounded mr-2"
                >
                  <option value="pending">pending</option>
                  <option value="in-progress">in-progress</option>
                  <option value="completed">completed</option>
                </select>

                <button
                  onClick={() => handleEdit(task.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <strong className="text-lg">
                      {task.title}
                    </strong>
                    <div
                      className={`text-sm mt-1 ${
                        task.status === "completed"
                          ? "text-green-600"
                          : task.status === "in-progress"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {task.status}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditingId(task.id);
                        setEditStatus(task.status);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;