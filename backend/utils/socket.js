// Shared Socket.IO instance holder.
// server.js sets the instance at startup; controllers read it at request-time.
// This breaks the circular dependency: server.js -> app.js -> routes -> controller -> server.js

/** @type {import('socket.io').Server | null} */
let io = null;

export function setIO(instance) {
  io = instance;
}

export function getIO() {
  return io;
}
