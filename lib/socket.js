const io = require('socket.io');

let socketServer = null;

function initializeSocket(server, options = {}) {
  socketServer = io(server, options);
  console.log('[Socket] Socket.IO server initialized');

  socketServer.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.id}`);
    });
  });
}

function emitToUser(userId, event, data) {
  if (!socketServer) {
    console.error('[Socket] Socket.IO server not initialized');
    return;
  }

  socketServer.to(userId).emit(event, data);
  console.log(`[Socket] Event emitted to user ${userId}: ${event}`);
}

function emitToRole(role, event, data) {
  if (!socketServer) {
    console.error('[Socket] Socket.IO server not initialized');
    return;
  }

  socketServer.to(role).emit(event, data);
  console.log(`[Socket] Event emitted to role ${role}: ${event}`);
}

function emitToAll(event, data) {
  if (!socketServer) {
    console.error('[Socket] Socket.IO server not initialized');
    return;
  }

  socketServer.emit(event, data);
  console.log(`[Socket] Event emitted to all: ${event}`);
}

function emitNewNews(newsData) {
  emitToAll('new_news', newsData);
}

function emitNewsUpdate(newsId, action, newsData) {
  emitToAll('news_update', { newsId, action, news: newsData });
}

module.exports = {
  initializeSocket,
  emitToUser,
  emitToRole,
  emitToAll,
  emitNewNews,
  emitNewsUpdate,
};