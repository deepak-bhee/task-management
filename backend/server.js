import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import app, { isOriginAllowed } from './app.js';
import connectDatabase from './config/database.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setIO } from './utils/socket.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true
  }
});

// Register io instance so controllers can access it without circular imports
setIO(io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // Join user-specific room
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined socket room`);
  });

  // Handle task updates
  socket.on('task:update', (data) => {
    socket.to(data.userId).emit('task_updated', data);
  });

  socket.on('task:create', (data) => {
    socket.to(data.userId).emit('task_created', data);
  });

  socket.on('task:delete', (data) => {
    socket.to(data.userId).emit('task_deleted', data);
  });

  socket.on('task:archive', (data) => {
    socket.to(data.userId).emit('task_archived', data);
  });

  socket.on('task:restore', (data) => {
    socket.to(data.userId).emit('task_restored', data);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});



try {
  await connectDatabase();
  httpServer.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
} catch (error) {
  console.error('Failed to start backend:');
  console.error(error.message || error);
  process.exit(1);
}
