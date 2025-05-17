// Replace with actual content// === Backend: server.js ===
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// === DB Setup ===
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// === Auth Middleware ===
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// === Login Route ===
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) return res.status(401).send('User not found');

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(403).send('Incorrect password');

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token });
});

// === Get Queue ===
app.get('/api/queue/:location', async (req, res) => {
  const { location } = req.params;
  const result = await pool.query(
    'SELECT * FROM dogs WHERE run_location = $1 ORDER BY position',
    [location]
  );
  res.json(result.rows);
});

// === Add to Queue ===
app.post('/api/queue/add', authenticateToken, async (req, res) => {
  const { handler_name, dog_name, breed, contact_email, contact_phone, run_location, position } = req.body;
  await pool.query(
    'INSERT INTO dogs (handler_name, dog_name, breed, contact_email, contact_phone, run_location, position) VALUES ($1,$2,$3,$4,$5,$6,$7)',
    [handler_name, dog_name, breed, contact_email, contact_phone, run_location, position]
  );
  res.sendStatus(201);
});

// === Update Dog Status ===
app.put('/api/queue/:id/status', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  await pool.query('UPDATE dogs SET status = $1 WHERE id = $2', [status, id]);
  res.sendStatus(200);
});

// === Notification Check ===
app.post('/api/notifications/check', async (req, res) => {
  const queues = ['Location A', 'Location B'];

  for (const location of queues) {
    const result = await pool.query(
      `SELECT * FROM dogs WHERE run_location = $1 AND status = 'waiting' ORDER BY position`,
      [location]
    );

    result.rows.forEach(async (dog, i) => {
      if (i === 0 && !dog.notified) {
        // Notify it's their turn
        await sendNotification(dog, `${dog.dog_name} is on course now.`);
        await markNotified(dog.id);
      } else if (i === 3 && !dog.notified) {
        // Notify 3 dogs ahead
        await sendNotification(dog, `${dog.dog_name} is 3 dogs away at ${location}. Get ready.`);
        await markNotified(dog.id);
      }
    });
  }
  res.send('Notifications checked');
});

const markNotified = async (id) => {
  await pool.query('UPDATE dogs SET notified = true WHERE id = $1', [id]);
};

const sendNotification = async (dog, message) => {
  // Send Email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: dog.contact_email,
    subject: 'Your Turn at Scentwork Trial',
    text: message
  });

  // Send SMS
  const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
  await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to: dog.contact_phone
  });
};

// === Start Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
