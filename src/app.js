require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// --- CORS CONFIGURATION (UPDATED) ---
// List the frontend URLs that are allowed to talk to this backend.
// Include your local development URL and your live Vercel URL.
const allowedOrigins = [
  'http://localhost:5173', // For local React development
  'https://role-based-project-issue-tracking-saa-s-platform-4uy2.vercel.app', // Your Vercel frontend URL
];

// The `cors()` middleware will now check the incoming request's Origin header
// against the list above. If it matches, the request is allowed.
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Important for sending cookies/auth headers
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
