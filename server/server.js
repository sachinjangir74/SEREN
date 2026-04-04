// Load env vars FIRST
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const http = require('http');
const { Server } = require('socket.io');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// --- SECURITY & CORS MIDDLEWARE (MUST BE FIRST) ---
// Define allowed origins
const envOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map(o => o.trim()) : [];
const defaultOrigins = [
  'http://localhost:5225', 
  'http://localhost:5173', 
  'http://127.0.0.1:5173', 
  'http://127.0.0.1:5225',
  'https://seren-lovat.vercel.app',
  'https://seren-2361mvewy-sachinjangir7427-gmailcoms-projects.vercel.app'
];
const allowedOrigins = [...new Set([...envOrigins, ...defaultOrigins])];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

// Apply CORS and OPTIONS Preflight first
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Set security headers with Helmet configured for CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" }
}));

// Body Parsers & Sanitization
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());

// --- LOGGING & OTHER MIDDLEWARE ---
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// CORS for the frontend via Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Sanitize data -> Protect against NoSQL Injection
// Write safe proxy for Express 5 compatibility
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj !== 'object' || obj === null) return;
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (key.includes('$') || key.includes('.')) {
          delete obj[key]; // Very strict NoSQL injection guard
        } else if (typeof obj[key] === 'object') {
          sanitize(obj[key]);
        }
      }
    }
  };
  if (req.body) sanitize(req.body);
  next();
});

// Prevent XSS attacks manually to bypass Express 5 conflicts
app.use((req, res, next) => {
  const sanitizeXSS = (obj) => {
    if (typeof obj !== 'object' || obj === null) return;
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === 'string') {
          // Simple XSS defang
          obj[key] = obj[key].replace(/</g, '&lt;').replace(/>/g, '&gt;');
        } else if (typeof obj[key] === 'object') {
          sanitizeXSS(obj[key]);
        }
      }
    }
  };
  if (req.body) sanitizeXSS(req.body);
  next();
});

// Rate Limiting (100 requests per 10 mins)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Prevent HTTP param pollution
app.use(hpp());

const ChatMessage = require('./models/ChatMessage');

// Socket.io integration
io.on('connection', (socket) => {

  socket.on('join_room', (room) => {
    socket.join(room);

  });

  socket.on('typing', ({ room, senderType }) => {
    socket.to(room).emit('display_typing', { senderType });
  });

  socket.on('stop_typing', ({ room, senderType }) => {
    socket.to(room).emit('hide_typing', { senderType });
  });

  socket.on('mark_read', async ({ room, readerType }) => {
    try {
      // Find unread messages not from this reader, mark read
      await ChatMessage.updateMany(
        { room, senderType: { $ne: readerType }, status: { $ne: 'read' } },
        { $set: { status: 'read' } }
      );
      // Let others in the room know messages were read
      socket.to(room).emit('messages_read');
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  });

  socket.on('send_message', async (data) => {

    try {
      // Save message to DB before broadcasting
      const newMessage = new ChatMessage({
        senderType: data.senderType || 'user',
        room: data.room,
        message: data.message,
        status: 'sent'
      });
      const savedMessage = await newMessage.save();

      const messageToEmit = { ...data, _id: savedMessage._id, status: savedMessage.status };
      socket.to(data.room).emit('receive_message', messageToEmit);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {

  });

  // WebRTC Signaling for Video Consultation
  socket.on('webrtc_offer', (data) => {
    socket.to(data.room).emit('webrtc_offer', { signal: data.signal, from: socket.id });
  });

  socket.on('webrtc_answer', (data) => {
    socket.to(data.room).emit('webrtc_answer', { signal: data.signal, from: socket.id });
  });

  socket.on('webrtc_ice_candidate', (data) => {
    socket.to(data.room).emit('webrtc_ice_candidate', { candidate: data.candidate, from: socket.id });
  });

  socket.on('webrtc_end_call', (data) => {
    socket.to(data.room).emit('webrtc_end_call');
  });
});

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes placeholders
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Product Features Routes
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/programs', require('./routes/programRoutes'));
app.use('/api/therapists', require('./routes/therapistRoutes'));
app.use('/api/assessments', require('./routes/assessmentRoutes'));
app.use('/api/mood', require('./routes/moodRoutes'));

// Set up automatic weekly reset for Mood Graph (Runs every Sunday at midnight)
const cron = require('node-cron');
const Mood = require('./models/Mood');

cron.schedule('0 0 * * 0', async () => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const result = await Mood.deleteMany({ createdAt: { $lt: startOfWeek } });

  } catch (error) {
    console.error('Error running automatic weekly mood reset:', error.message);
  }
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  // Always log error details in the server console for diagnostics
  console.error(`ERROR [${req.method} ${req.url}]: ${err.message}`);
  if (process.env.NODE_ENV !== 'production' || statusCode === 500) {
    console.error(err.stack);
  }

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Handle Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  // Handle Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {

  });
}

module.exports = { app, server };

