// backend/server.js

console.log('--- Starting server.js ---');

// 1. Load environment variables
try {
  require('dotenv').config();
  console.log('✅ dotenv loaded.');
} catch (error) {
  console.error('❌ FATAL: Could not load dotenv.', error);
  process.exit(1);
}

// 2. Load dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
console.log('✅ Dependencies loaded (express, mongoose, cors, path).');

// 3. Check for MONGO_URI
const mongoUri = process.env.MONGO_URI;
if (!mongoUri || mongoUri === 'your_connection_string') {
  console.error('❌ FATAL: MONGO_URI is not defined or is not set in your .env file.');
  process.exit(1);
}
console.log('✅ MONGO_URI found.');

// 4. Initialize the app
const app = express();
const PORT = process.env.PORT || 10000;
console.log('✅ Express app initialized.');

// 5. Middleware
app.use(cors());
app.use(express.json());

// 6. Connect to MongoDB
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected.'))
.catch(err => console.error('❌ MongoDB connection failed:', err));

// 7. Serve static frontend files (from root)
const rootDir = path.join(__dirname, '..');
app.use(express.static(rootDir));

// 8. Routes for HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});
app.get('/admin', (req, res) => {
  res.sendFile(path.join(rootDir, 'admin-login.html'));
});
app.get('/guest', (req, res) => {
  res.sendFile(path.join(rootDir, 'guest-index.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(rootDir, 'admin-dashboard.html'));
});
app.get('/lecturette', (req, res) => {
  res.sendFile(path.join(rootDir, 'lecturette-view.html'));
});

// 9. API Test route (you can add more APIs below)
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Backend is working!' });
});

// 10. Fallback (for React-SPA-style routing, optional)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(rootDir, 'index.html'));
// });

// 11. Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
