import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Eventify API',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Example events endpoint
app.get('/api/events', (req, res) => {
  res.json({
    events: [],
    message: 'Events endpoint - ready for implementation'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎉 Eventify server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
