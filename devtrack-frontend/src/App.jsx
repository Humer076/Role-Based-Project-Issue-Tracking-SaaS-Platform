import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import MyTasks from "./pages/MyTasks";
import Register from "./pages/Register";
import ProjectDetails from "./pages/ProjectDetails";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Developers from "./pages/Developers";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* MY TASKS */}
          <Route
            path="/my-tasks"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyTasks />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* PROJECT DETAILS */}
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProjectDetails />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ALL PROJECTS */}
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Layout>
                  <Projects />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ALL TASKS */}
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Layout>
                  <Tasks />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ALL DEVELOPERS */}
          <Route
            path="/developers"
            element={
              <ProtectedRoute>
                <Layout>
                  <Developers />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;