require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// ✅ SIMPLEST CORS – allow all origins (perfect for debugging)
app.use(cors());
app.options('*', cors()); // enable pre-flight for all routes

app.use(express.json());

// Route imports
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/task.routes');
const userRoutes = require('./routes/user.routes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('DevTrack API running 🚀');
});

module.exports = app;
