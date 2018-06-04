const env = process.env.NODE_ENV
const config = {
  awsRegion: process.env.APP_AWS_DEFAULT_REGION,
  awsAccessKey: process.env.APP_AWS_ACCESS_KEY_ID,
  awsSecret: process.env.APP_AWS_SECRET_ACCESS_KEY,
  env
}

config.dbname = `mg-motors-${env}`
config.mongoUser = process.env.MONGO_USER
config.mongoPassword = process.env.MONGO_PWD
config.mongoHost = process.env.MONGO_HOST

module.exports = config
