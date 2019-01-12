const Datastore = require('nedb');

const db = new Datastore({ filename: process.env.JOBS_DB_PATH || 'jobs.db', autoload: true });
let sendJobTimeout;

const sendJobs = (log, ws) =>
  sendJobTimeout = setTimeout(() => {
    try {
      ws.send(JSON.stringify({ request: 'data', data: db.getAllData() }));
    } catch (e) {
      log.error('Error when sending jobs: ', e);
      clearTimeout(sendJobTimeout);
    }
  }, process.env.JOB_TIMEOUT || 10000);

const addJob = (log, ws, job, cb) =>
  db.insert(job, (err) => {
    if (err) cb(err)
    else {
      sendJobs(log, ws);
      cb(null);
    }
  });

module.exports = {
  sendJobs,
  addJob
};
