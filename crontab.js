require('crontab').load(function(err, crontab) {
  if (err) {
    return console.error(err);
  }

  var job,
      jobName,
      notifierPath = '/var/apps/performanceplatform-notifier';

  jobName = 'performanceplatform-notifier_out-of-date';

  crontab.remove({comment: jobName});
  job = crontab.create('cd ' + notifierPath + ' && npm run-script out-of-date', null, jobName);
  job.minute().at(0);

  jobName = 'performanceplatform-notifier_summaries';

  crontab.remove({comment: jobName});
  job = crontab.create('cd ' + notifierPath + ' && npm run-script summaries', null, jobName);
  job.minute().at(0);
  job.hour().at(7);
  job.dow().on(1);

  crontab.save(function(err, crontab) {
    if (err) {
      console.log(err);
    }
  });
});
