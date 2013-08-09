module.exports = process.env.TEST_COV
  ? require('./lib-cov/openbadges-validator-service')
  : require('./lib/openbadges-validator-service');