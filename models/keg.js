var keg = {
    'IsActive': function (id, callback) {
        if(!id || isNaN(parseInt(id))){
            callback({'error': 'Please provide a valid keg id.'});
        }
        else if (req.pool) {
            req.pool.getConnection(function (err, conn) {
                if (conn) {
                    conn.query('select active from kegs where kegid = ?', id, function (err, result) {
                        if (err) {
                            console.error('error: ', err);
                            callback({'error': err});
                        }
                        else if (result.length > 0) {
                            callback(null, result);
                        }
                        else {
                            console.log('No matching keg found.\n', result);
                            callback(null, false);
                        }
                    });
                    conn.release();
                }
                else{
                    // todo: handle this case.
                    callback({'error': 'An error occurred attempting to retrieve the requested data. Please try again at a later time.'})
                }
            });
        }
        else{
            callback({'error': 'An error occurred attempting to retrieve the requested data. Please try again at a later time.'})
        }
    }
};

module.exports = keg;