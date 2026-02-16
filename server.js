require('dotenv').config();

const app = require('./src/app');
const pool = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Database Connection Check
pool.connect()
  .then(() => {
    console.log('Database connected successfully ✅');
  })
  .catch((err) => {
    console.error('Database connection failed ❌', err);
  });

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});