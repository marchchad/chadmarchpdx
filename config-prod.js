var config = {
  'secret': 'mybrewpisecret',
  'sessionId': 'mybrewpisession',
  'host': process.env.OPENSHIFT_MYSQL_DB_HOST || '127.0.0.1',
  'user': 'ipaapi',
  'password': 'ipaapi',
  'database': 'ipaapi',
  'google': {
    'client': {
      'id': '507842711005-h5i3q8d9m5gpofi2u2c1rg4km5grc831.apps.googleusercontent.com',
      'secret': 'aukNOCjJ4xgW73rW8Gfg7GoF'
    },
    'callbackURL': 'http://www.chadmarchpdx.com/admin/google/callback'
  }
};

config['dburi'] = 'mysql://' + config.user + ':' + config.password + '@' + config.host + '/' + config.database;

module.exports = config;