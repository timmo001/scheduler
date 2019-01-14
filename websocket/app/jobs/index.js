const scheduler = require('node-schedule'),
  { spawn } = require('child_process'),
  moment = require('moment');

const shellSpawn = (log, job, cb) => {
  job.last_run = moment().format();
  job.status = -2;
  job.output = '';
  job.error = '';

  const { name, command, args, cwd } = job;
  log.info(`JOBS: Start ${name}`);

  let spawnedJob = spawn(command, args, { cwd, shell: true });
  job.status = -1;
  spawnedJob.stdout.on('data', (data) => {
    log.debug(`JOBS: ${name} - ${data}`);
    job.output += data;
    cb(job);
  });
  spawnedJob.stderr.on('data', (data) => {
    log.error(`JOBS: ${name} - ${data}`);
    job.error += data;
    cb(job);
  });
  spawnedJob.on('error', (data) => {
    log.error(`JOBS: ${name} - ${data}`);
    job.error += data;
    cb(job);
  });
  spawnedJob.on('close', (code) => {
    log.info(`JOBS: ${name} exited with code ${code}`);
    job.status = code;
    cb(job);
  });
};


const shell = (log, job, cb) => {
  const { name, schedule } = job;
  log.debug(`JOBS: Job: ${name} - `, job);
  job.schedule === 'always' ?
    shellSpawn(log, job, cb) :
    scheduler.scheduleJob(schedule, () => shellSpawn(log, job, cb));
};

module.exports = (log, connections, removeConnection) => {
  const jobs = require('../common/jobs');
  setTimeout(() => {
    log.info('JOBS: Start jobs..');
    jobs.getJobs().map(job => {
      switch (job.type) {
        default:
          return shell(log, job, jobRet => jobs.updateJob(jobRet, err => {
            err && log.error('Error updating job: ', err);
            connections.map(c => jobs.sendJobs(log, c.ws, true, removeConnection));
          }));
      }
    });
  }, 1000);
};
