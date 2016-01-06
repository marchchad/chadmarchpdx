// These are used for demo purposes only.
var config = {
  'secret': 'mybrewpisecret',
  'host': process.env.OPENSHIFT_MYSQL_DB_HOST || 'localhost',
  'user': (process.env.OPENSHIFT_MYSQL_DB_HOST ? 'ipaapi' : 'root'),
  'password': (process.env.OPENSHIFT_MYSQL_DB_HOST ? 'ipaapi' : 'admin'),
  'database': (process.env.OPENSHIFT_MYSQL_DB_HOST ? 'ipaapi' : 'test')
};

config['dburi'] = 'mysql://' + config.user + ':' + config.password + '@' + config.host + '/' + config.database;

module.exports = config;