const fs      = require('fs');
const request = require('request');

module.exports = {
    download: function(uri, filename, callback){
        return new Promise((resolve, reject) => {
            request.head(uri, function(err, res, body){
                if(!err) {
                    console.log('content-type:', res.headers['content-type']);
                    console.log('content-length:', res.headers['content-length']);
                
                    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);

                    resolve();    
                } else {
                    console.log()
                    reject(err);    
                }
            });
        })
    }    
}