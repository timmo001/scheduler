const WebSocket = require('ws'),
  users = require('./common/users');

module.exports = (log, server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    ws.on('message', incoming = (message) => {
      message = JSON.parse(message);
      switch (message.request) {
        case 'login':
          require('./login')(log, ws, message, users, {});
          break;
        case 'add_job':
          require('./addJob')(log, ws, message, users, {});
          break;
      }
    });

    ws.on('close', () => {
      // clearInterval(id);
    });
  });

};
