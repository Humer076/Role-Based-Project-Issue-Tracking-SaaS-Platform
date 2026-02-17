const express = require('express');
const cors = require('cors');

const app = express();

/* ==============================
   CORS Configuration
============================== */
const allowedOrigins = [
  "http://localhost:5173",
  "https://role-based-project-issue-tracking-s.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, curl, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      return callback(null, true); // temporarily allow all (safe for now)
    }
  },
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

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
const dashboardRoutes = require('./routes/dashboardRoutes');

/* ==============================
   API Routes
============================== */
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

/* ==============================
   Health Check Route
============================== */
app.get('/', (req, res) => {
  res.send('DevTrack API running 🚀');
});

module.exports = app;