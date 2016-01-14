// These are used for demo purposes only.
var config = {
  'secret': 'mybrewpisecret',
  'host': process.env.OPENSHIFT_MYSQL_DB_HOST || 'localhost',
  'user': (process.env.OPENSHIFT_MYSQL_DB_HOST ? 'ipaapi' : 'root'),
  'password': (process.env.OPENSHIFT_MYSQL_DB_HOST ? 'ipaapi' : 'admin'),
  'database': (process.env.OPENSHIFT_MYSQL_DB_HOST ? 'ipaapi' : 'test'),
  'google': {
    'client': {
      'id': '685058428888-g0g53l1u488k4oo0plpjbalaihjb7jl8.apps.googleusercontent.com',
      'secret': 'TxMRF0z2Qkc4qq3CRdrOQKOE'
    }
  }
};

// Create a dburi for convenience
config['dburi'] = 'mysql://' + config.user + ':' + config.password + '@' + config.host + '/' + config.database;

module.exports = config;