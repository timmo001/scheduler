const scheduler = require('node-schedule'),
  { spawn } = require('child_process'),
  moment = require('moment'),
  runningJobs = [];

const shellSpawn = (log, job, cb) => {
  job.last_run = moment().format();
  job.status = -2;
  job.output = '';
  job.error = '';

  const { name, command, args, cwd } = job;
  log.info(`JOBS: Start ${name}`);

  job.spawnedJob = spawn(command, args, { cwd, shell: true });
  job.status = -1;
  job.spawnedJob.stdout.on('data', (data) => {
    log.debug(`JOBS: ${name} - ${data}`);
    job.output += data;
    cb(job);
  });
  job.spawnedJob.stderr.on('data', (data) => {
    log.error(`JOBS: ${name} - ${data}`);
    job.error += data;
    cb(job);
  });
  job.spawnedJob.on('error', (data) => {
    log.error(`JOBS: ${name} - ${data}`);
    job.error += data;
    cb(job);
  });
  job.spawnedJob.on('close', (code) => {
    log.info(`JOBS: ${name} exited with code ${code}`);
    job.status = code;
    cb(job);
  });
};

const shell = (log, job, cb) => {
  const { schedule } = job;
  job.schedule === 'always' ?
    shellSpawn(log, job, cb) :
    scheduler.scheduleJob(schedule, () => shellSpawn(log, job, cb));
};

const startJob = (log, connections, job, removeConnection) => {
  log.info('JOBS: Add Job: ', job.name);
  runningJobs.push(job);
  if (job.enabled)
    switch (job.type) {
      default:
        return shell(log, job, jobRet => require('../common/jobs').updateJob(jobRet, err => {
          if (err) { log.error('Error updating job: ', err); return; }
          connections.map(c => require('../common/jobs').sendJobs(log, c.ws, true, removeConnection));
        }));
    }
};

const startAllJobs = (log, connections, removeConnection) => {
  setTimeout(() => {
    log.info('JOBS: Start jobs..');
    require('../common/jobs').getJobs().map(job => startJob(log, connections, job, removeConnection));
  }, 1000);
};

const startNewJobs = (log, connections, removeConnection) => {
  log.info('JOBS: Start New jobs..');
  require('../common/jobs').getJobs().map(job => {
    if (runningJobs.find(j => j['_id'] === job['_id'])) return null;
    return startJob(log, connections, job, removeConnection);
  });
};

const removeJobs = (log, jobs, cb) => {
  log.info('JOBS: Remove jobs..');
  require('../common/jobs').removeJobs(jobs, () =>
    jobs.map(id => {
      const jobId = runningJobs.findIndex(j => j['_id'] === id);
      const job = runningJobs[jobId];
      if (job && job.type === 'shell' && job.spawnedJob && job.status < 0) {
        job.spawnedJob.stdin.pause();
        job.spawnedJob.kill();
      }
      cb();
      return runningJobs.splice(jobId);
    })
  );
};

const updateJob = (log, connections, job, removeConnection, cb) => {
  log.info('JOBS: Update job..');
  require('../common/jobs').updateJob(job, err => {
    if (err) return;
    cb();
    if (job && job.type === 'shell' && job.spawnedJob && job.status < 0) {
      job.spawnedJob.stdin.pause();
      job.spawnedJob.kill();
    }
    return startJob(log, connections, job, removeConnection);
  });
};

module.exports = {
  startAllJobs,
  startNewJobs,
  removeJobs,
  updateJob
};
