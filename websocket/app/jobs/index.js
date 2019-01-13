const schedule = require('node-schedule'),
  { spawn } = require('child_process');

module.exports = (log) => {
  const jobs = require('../common/jobs');
  setTimeout(() => {
    log.info('Start jobs..');
    jobs.getJobs().map(job => {
      log.debug(`Job: ${job.name} - ${job.command} `, job.args);
      return schedule.rescheduleJob(job.schedule, () => {
        log.info(`Start ${job.name}`);
        let command = spawn(job.command, job.args);
        command.stdout.on('data', (data) => {
          log.info(`${job.name} - ${data}`);
          job.output = data;
          jobs.updateJob(job, err => err && log.error('Error updating job: ', err));
        });
        command.stderr.on('data', (data) => {
          log.error(`${job.name} - ${data}`);
          job.error = data;
          jobs.updateJob(job, err => err && log.error('Error updating job: ', err));
        });
        command.on('close', (code) => {
          log.info(`${job.name} exited with code ${code}`);
        });
      });
    })
  }, 1000);
};
