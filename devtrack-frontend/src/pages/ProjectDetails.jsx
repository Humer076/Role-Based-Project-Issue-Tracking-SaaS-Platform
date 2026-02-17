import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProjectDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const decoded = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const userRole = decoded?.role;
  const userId = decoded?.id;

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  /* ================= FETCH TASKS ================= */
  const fetchTasks = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/tasks?project_id=${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("FETCH TASK ERROR:", error);
    }
  };

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("USER FETCH ERROR:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [id]);

  /* ================= CREATE TASK ================= */
  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!title.trim() || !assignedTo) {
      alert("Title and Developer selection required");
      return;
    }

    try {
      await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          project_id: parseInt(id),
          assigned_to: parseInt(assignedTo),
        }),
      });

      setTitle("");
      setDescription("");
      setAssignedTo("");
      fetchTasks();
    } catch (error) {
      console.error("CREATE TASK ERROR:", error);
    }
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (taskId, newStatus) => {
    try {
      await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      fetchTasks();
    } catch (error) {
      console.error("UPDATE STATUS ERROR:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">Project Tasks</h1>

        {/* ================= CREATE TASK FORM ================= */}
        {userRole === "admin" && (
          <div className="bg-white p-6 rounded-xl shadow mb-10">
            <h2 className="text-xl font-semibold mb-4">Create New Task</h2>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <input
                type="text"
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <textarea
                placeholder="Task Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Assign Developer</option>
                {users
                  .filter((user) => user.role === "developer")
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
              </select>

              <button
                type="submit"
                className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Create Task
              </button>
            </form>
          </div>
        )}

        {/* ================= TASK LIST ================= */}
        {tasks.length === 0 ? (
          <p className="text-gray-600">No tasks found</p>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold mb-2">{task.title}</h3>
                <p className="text-gray-600 mb-3">{task.description}</p>

                <p className="mb-1">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={
                      task.status === "completed"
                        ? "text-green-600"
                        : task.status === "in-progress"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }
                  >
                    {task.status}
                  </span>
                </p>

                <p className="mb-4">
                  <span className="font-semibold">Assigned To:</span>{" "}
                  {users.find((u) => u.id === task.assigned_to)?.name ||
                    "Unassigned"}
                </p>

                {(userRole === "admin" ||
                  task.assigned_to === userId) && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(task.id, "pending")}
                      className="px-3 py-1 bg-yellow-400 rounded-lg hover:bg-yellow-500"
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => updateStatus(task.id, "in-progress")}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => updateStatus(task.id, "completed")}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Completed
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetails;