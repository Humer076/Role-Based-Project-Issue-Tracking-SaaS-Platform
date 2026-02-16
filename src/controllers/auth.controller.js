const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const bcrypt = require('bcrypt');

// ================= REGISTER =================
exports.register = async (req, res) => {
  const client = await pool.connect();

  try {
    const { name, email, password, organizationName } = req.body;

    console.log("REGISTER BODY:", req.body);

    if (!name || !email || !password || !organizationName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    await client.query('BEGIN');

    // Check if user already exists
    const existingUser = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create organization
    const orgResult = await client.query(
      'INSERT INTO organizations (name) VALUES ($1) RETURNING id',
      [organizationName]
    );

    const organizationId = orgResult.rows[0].id;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (admin by default)
    const userResult = await client.query(
      `INSERT INTO users (name, email, password, role, organization_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, role, organization_id`,
      [name, email, hashedPassword, 'admin', organizationId]
    );

    await client.query('COMMIT');

    const user = userResult.rows[0];

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        organization_id: user.organization_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User & Organization created successfully ✅',
      token
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("REGISTER ERROR FULL:", error);

    // Return actual error message for debugging
    res.status(500).json({
      message: error.message,
      detail: error.detail || null,
      code: error.code || null
    });

  } finally {
    client.release();
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        organization_id: user.organization_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful ✅',
      token
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};