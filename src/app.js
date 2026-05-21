require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// CORS – allow your Vercel frontend (change the URL to yours)
const allowedOrigins = [
  'http://localhost:5173',
  'https://role-based-project-issue-tracking-saa-s-platform-4uy2.vercel.app', // change to your actual Vercel URL
  'https://role-based-project-issue-tracking-saas-0vo9.onrender.com' // your backend itself
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

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
