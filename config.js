// These are used for demo purposes only.
var config = {
  'secret': 'mybrewpisecret',
  'sessionId': 'mybrewpisession',
  'host': process.env.OPENSHIFT_MYSQL_DB_HOST || '127.0.0.1',
  'user': 'ipaapi',
  'password': 'ipaapi',
  'database': 'ipaapi',
  'google': {
    'client': {
      'id': '685058428888-g0g53l1u488k4oo0plpjbalaihjb7jl8.apps.googleusercontent.com',
      'secret': 'TxMRF0z2Qkc4qq3CRdrOQKOE'
    },
    'callbackURL': 'http://127.0.0.1:3000/admin/google/callback'
  }
};

// Create a dburi for convenience
config['dburi'] = 'mysql://' + config.user + ':' + config.password + '@' + config.host + ':3306/' + config.database;

module.exports = config;