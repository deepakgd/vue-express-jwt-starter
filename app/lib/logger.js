const winston = require('winston')
const WinstonCloudWatch = require('winston-cloudwatch')

// when you don't provide a name the default one
// is CloudWatch
['general', 'metrics'].forEach((logstream, i) => {
  winston.transports[`CloudWatch${i}`] = WinstonCloudWatch
  winston.loggers.add(logstream, {
    // note that this is the same property name
    // that we've added to winston.transports
    [`CloudWatch${i}`]: {
      awsRegion: process.env.APP_AWS_DEFAULT_REGION,
      awsAccessKeyId: process.env.APP_AWS_ACCESS_KEY_ID,
      awsSecretKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
      logGroupName: `cnc-bot-${process.env.NODE_ENV}`,
      logStreamName: logstream
    }
  })
})

module.exports = {
  metrics: winston.loggers.get('metrics'),
  general: winston.loggers.get('general')
}
