const WebSocket = require('ws'),
  uuid = require('uuid'),
  users = require('./common/users');

module.exports = (log, server) => {
  const wss = new WebSocket.Server({ server });
  wss.on('connection', (ws) => {
    ws.id = uuid.v4();
    ws.send(JSON.stringify({ request: 'id', id: ws.id }));
    log.debug('WS - New connection: ', ws.id);

    ws.on('message', (message) => {
      message = JSON.parse(message);
      switch (message.request) {
        default: break;
        case 'login':
          require('./login')(log, ws, message, users, {});
          break;
        case 'add_job':
          require('./addJob')(log, ws, message, users, {});
          break;
      }
    });
    ws.on('close', () => { });
  });
  require('./jobs')(log);
};
