import { useEffect, useState } from "react";

function MyTasks() {
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchTasks = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("FETCH TASK ERROR:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateStatus = async (taskId, newStatus) => {
    try {
      await fetch(
        `${API_URL}/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      fetchTasks();
    } catch (error) {
      console.error("UPDATE STATUS ERROR:", error);
    }
  };

  // ✅ FILTER LOGIC
  const filteredTasks =
    filter === "all"
      ? tasks
      : tasks.filter((task) => task.status === filter);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">My Tasks</h2>

      {/* FILTER DROPDOWN */}
      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-gray-500">No tasks found</p>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <h4 className="font-semibold text-lg">
                {task.title}
              </h4>

              <p className="text-gray-600 mt-1">
                {task.description}
              </p>

              {/* STATUS BADGE */}
              <div
                className={`mt-2 text-sm font-medium ${
                  task.status === "completed"
                    ? "text-green-600"
                    : task.status === "in-progress"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {task.status}
              </div>

              {/* STATUS BUTTONS */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => updateStatus(task.id, "pending")}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Pending
                </button>

                <button
                  onClick={() => updateStatus(task.id, "in-progress")}
                  className="px-3 py-1 bg-yellow-200 rounded hover:bg-yellow-300"
                >
                  In Progress
                </button>

                <button
                  onClick={() => updateStatus(task.id, "completed")}
                  className="px-3 py-1 bg-green-200 rounded hover:bg-green-300"
                >
                  Completed
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTasks;