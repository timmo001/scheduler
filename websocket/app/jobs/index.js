const schedule = require('node-schedule'),
  { spawn } = require('child_process');

module.exports = (log) => {
  const jobs = require('../common/jobs');
  setTimeout(() => {
    log.info('Start jobs..');
    jobs.getJobs().map(job => {
      log.debug(`Job: ${job.name} - `, job);
      return schedule.scheduleJob(job.schedule, () => {
        log.info(`Start ${job.name}`);
        job.output = '';
        job.status = -1;
        let command = spawn(job.command, job.args);
        command.stdout.on('data', (data) => {
          log.info(`${job.name} - ${data}`);
          job.output += data;
        });
        command.stderr.on('data', (data) => {
          log.error(`${job.name} - ${data}`);
          job.output += data;
        });
        command.on('close', (code) => {
          job.status = code;
          jobs.updateJob(job, err => err && log.error('Error updating job: ', err));
          log.info(`${job.name} exited with code ${code}`);
        });
      });
    })
  }, 1000);
};
