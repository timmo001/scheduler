const jobs = require('./common/jobs');

module.exports = (log, ws, req, users) => {
  users.getUser(req.login, true, (err, user) => {
    if (!err) {
      console.log(`User ${user.username} found.`);
      jobs.addJob(ws, req.job, (err, jobs) => {
        if (err) {
          log.error(err);
          ws.send(JSON.stringify({ request: 'add_job', data: null, message: err }));
          return;
        }
        ws.send(JSON.stringify({ request: 'add_job', data: jobs }));
      });
    }
  });
};
