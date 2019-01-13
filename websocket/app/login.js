const jobs = require('./common/jobs');

module.exports = (log, ws, req, users) => {
  users.getUser(req.login, true, (err, user) => {
    if (err) {
      log.error('WS - ', err);
      ws.send(JSON.stringify({ request: 'login', accepted: false, message: err }));
      return;
    }
    log.debug(`WS - User ${user.username} found.`);
    ws.send(JSON.stringify({ request: 'login', accepted: true }));
    jobs.sendJobs(log, ws);
  });
};
