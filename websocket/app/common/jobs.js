const Datastore = require('nedb');

const db = new Datastore({ filename: process.env.JOBS_DB_PATH || 'jobs.db', autoload: true });

const addJob = (job, cb) =>
  db.insert(job, (err) => {
    if (err) cb(err);
    else cb(null);
  });

const updateJob = (job, cb) =>
  db.update({ _id: job._id }, job, { multi: false, upsert: false, returnUpdatedDocs: false }, err => err ? cb(err) : cb(null));

const getJobs = () => db.getAllData();

const sendJobs = (log, ws, once, removeConnection) => {
  try {
    ws.send(JSON.stringify({ request: 'data', data: getJobs() }));
  } catch (e) {
    log.error(`WS - Error when sending jobs for ${ws.id}: `, e.message);
    removeConnection(ws.id);
  }
  if (!once) {
    let sendJobTimeout = setInterval(() => {
      log.debug(`WS - Send jobs.. (${ws.id})`);
      try {
        ws.send(JSON.stringify({ request: 'data', data: getJobs() }));
      } catch (e) {
        log.error(`WS - Error when sending jobs for ${ws.id}: `, e.message);
        clearInterval(sendJobTimeout);
        removeConnection(ws.id);
      }
    }, process.env.SEND_JOB_INTERVAL || 10000);
  }
};

const removeJobs = (jobs, cb) => jobs.map(id =>
  db.remove({ _id: id }, {}, err => err ? cb(err) : cb(null)));

module.exports = {
  addJob,
  updateJob,
  getJobs,
  sendJobs,
  removeJobs
};
