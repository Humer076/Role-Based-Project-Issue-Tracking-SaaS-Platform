const express = require('express');
const cors = require('cors');

const app = express();

/* ==============================
   CORS Configuration
============================== */
app.use(cors({
  origin: "http://localhost:5173", // Frontend URL
  credentials: true
}));

/* ==============================
   Middleware
============================== */
app.use(express.json());

/* ==============================
   Route Imports
============================== */
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/task.routes');
const userRoutes = require('./routes/user.routes');
const dashboardRoutes = require('./routes/dashboardRoutes'); // ✅ NEW

/* ==============================
   API Routes
============================== */
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes); // ✅ NEW

/* ==============================
   Health Check Route
============================== */
app.get('/', (req, res) => {
  res.send('DevTrack API running 🚀');
});

module.exports = app;