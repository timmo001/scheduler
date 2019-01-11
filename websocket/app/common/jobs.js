const Datastore = require('nedb');

const db = new Datastore({ filename: process.env.JOBS_DB_PATH || 'jobs.db', autoload: true });

const sendJobs = (ws) => {
  setTimeout(() => {
    ws.send(JSON.stringify({ request: 'data', data: db.getAllData() }));
  }, process.env.JOB_TIMEOUT || 10000);
};

const addJob = (ws, job, cb) => {
  db.insert(job, (err) => {
    if (err) cb(err)
    else {
      sendJobs(ws);
      cb(null);
    }
  });
};

module.exports = {
  sendJobs,
  addJob
};
