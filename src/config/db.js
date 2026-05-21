const { Pool } = require('pg');

// TEMPORARY HARDCODED CONNECTION – FOR TESTING ONLY
const pool = new Pool({
  host: 'aws-1-ap-southeast-1.pooler.supabase.com',
  user: 'postgres.atdcbvqlqmofzubbzyyi',
  password: 'DevTrackProject2025',
  database: 'postgres',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

// Test connection immediately
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected successfully!');
    release();
  }
});

module.exports = pool;
