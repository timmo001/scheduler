const jobs = require('./common/jobs');

module.exports = (log, ws, req, users) => {
  users.getUser({ username: process.env.USERNAME, password: process.env.PASSWORD }, true, (err, user) => {
    if (!err) {
      console.log(`User ${user.username} found.`);
      jobs.addJob(req.job, (err, jobs) => {
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
