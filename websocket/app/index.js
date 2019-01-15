const WebSocket = require('ws'),
  uuid = require('uuid'),
  users = require('./common/users'),
  jobs = require('./common/jobs'),
  jobsRunner = require('./jobs'),
  connections = [];

const removeConnection = id =>
  connections.splice(connections.findIndex(c => c.ws.id === id));

const checkUser = (log, login, cb) =>
  users.getUser(login, true, (err, user) => {
    log.debug(`WS - User ${user.username} found.`);
    cb(err);
  });

module.exports = (log, server) => {
  const wss = new WebSocket.Server({ server });
  wss.on('connection', (ws) => {
    ws.id = uuid.v4();
    ws.send(JSON.stringify({ request: 'id', id: ws.id }));
    log.debug('WS - New connection: ', ws.id);

    ws.on('message', (message) => {
      message = JSON.parse(message);
      switch (message.request) {
        default: return;
        case 'login':
          return require('./login')(log, ws, message, users, (user) => {
            connections.push({ user, ws });
            jobs.sendJobs(log, ws, true, removeConnection);
          }, {});
        case 'add_job':
          return checkUser(log, message.login, err =>
            !err && require('./addJob')(log, ws, message, removeConnection, () => {
              jobsRunner.startNewJobs(log, connections, removeConnection);
              connections.map(c => jobs.sendJobs(log, c.ws, true, removeConnection));
            }, {})
          );
        case 'delete_jobs':
          return checkUser(log, message.login, err =>
            !err && require('./addJob')(log, ws, message, removeConnection, () => {
              jobsRunner.removeJobs(log, message.jobs, () =>
                connections.map(c => jobs.sendJobs(log, c.ws, true, removeConnection))
              );
            }, {})
          );
      }
    });
    ws.on('close', () => { });
  });
  jobsRunner.startAllJobs(log, connections, removeConnection);
};
