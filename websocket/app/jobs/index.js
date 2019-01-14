const scheduler = require('node-schedule'),
  { spawn } = require('child_process');

module.exports = (log) => {
  const jobs = require('../common/jobs');
  setTimeout(() => {
    log.info('JOBS: Start jobs..');
    jobs.getJobs().map(job => {
      const { name, command, schedule, args, cwd } = job;
      log.debug(`JOBS: Job: ${name} - `, job);
      return scheduler.scheduleJob(schedule, () => {
        log.info(`JOBS: Start ${name}`);
        job.output = '';
        job.error = '';
        job.status = -1;
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
