const jobs = require('./common/jobs');

module.exports = (log, ws, req, removeConnection, cb) => {
  jobs.addJob(log, ws, req.job, (err) => {
    if (err) {
      log.error('WS - ', err);
      ws.send(JSON.stringify({ request: 'add_job', success: false, message: err }));
      removeConnection(ws.id);
      return;
    }
    ws.send(JSON.stringify({ request: 'add_job', success: true }));
    cb();
  });
};
