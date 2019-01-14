const scheduler = require('node-schedule'),
  { spawn } = require('child_process'),
  moment = require('moment');

module.exports = (log) => {
  const jobs = require('../common/jobs');
  setTimeout(() => {
    log.info('JOBS: Start jobs..');
    jobs.getJobs().map(job => {
      const { name, command, schedule, args, cwd } = job;
      log.debug(`JOBS: Job: ${name} - `, job);
      return scheduler.scheduleJob(schedule, () => {
        job.last_run = moment().format();
        job.status = -1;
        job.output = '';
        job.error = '';

        log.info(`JOBS: Start ${name}`);

        let spawnedJob = spawn(command, args, { cwd, shell: true });
        spawnedJob.stdout.on('data', (data) => {
          log.debug(`JOBS: ${name} - ${data}`);
          job.output += data;
        });
        spawnedJob.stderr.on('data', (data) => {
          log.error(`JOBS: ${name} - ${data}`);
          job.error += data;
        });
        spawnedJob.on('error', (data) => {
          log.error(`JOBS: ${name} - ${data}`);
          job.error += data;
        });
        spawnedJob.on('close', (code) => {
          log.info(`JOBS: ${name} exited with code ${code}`);
          job.status = code;
          jobs.updateJob(job, err => err && log.error('Error updating job: ', err));
        });
      });
    })
  }, 1000);
};
