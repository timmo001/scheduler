const jobs = require('./common/jobs');

module.exports = (log, ws, req, users) => {
  users.getUser(req.login, true, (err, user) => {
    if (!err) {
      console.log(`User ${user.username} found.`);
      jobs.addJob(log, ws, req.job, (err) => {
        if (err) {
          log.error(err);
          ws.send(JSON.stringify({ request: 'add_job', success: false, message: err }));
          return;
        }
        ws.send(JSON.stringify({ request: 'add_job', success: true }));
        require('./jobs')(log);
      });
    }
  });
};
