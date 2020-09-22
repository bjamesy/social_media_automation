const twitter        = require('twitter');
const { download }   = require('./tweetMedia');
const fs             = require('fs');

const tweet = (seed) => {
    return new Promise((resolve, reject) => {        
        seed
            .then(post => {
                const client = new twitter({
                    consumer_key: post.consumer_key,
                    consumer_secret: post.consumer_secret,
                    access_token_key: post.access_token_key,
                    access_token_secret: post.access_token_secret
                });

                if(post.image) {
                    download(post.image, post.fileName, function() {
                        // callback to twitter media DOWNLOAD method 
                        const data = fs.readFileSync(post.fileName); 

                        client.post('media/upload', { media: data }, function(err, media, response) {
                            if (!err) {
                                // If successful, a media object will be returned.
                                console.log(media);
                            
                                // Lets tweet it
                                let status = {
                                    status: post.content.toString(),
                                    media_ids: media.media_id_string // Pass the media id string
                                }
                            
                                client.post('statuses/update', status, function(err, tweet, response) {
                                    if(!err) {
                                        console.log(`${ post.name } TWEET: `, tweet);
                                        resolve();
                                    } else {
                                        console.log(`TwITTER ${ post.name } error: `, err);
                                        reject(err);                    
                                    }
                                });
                            } else {
                                console.log(`TWITTER ${ post.name } error: `, err);
                                reject(err);
                            }
                        })
                    })
                } else {
                    client.post('statuses/update', { status: post.content }, function(err, tweet, response) {
                        if(err) {
                            console.log(`${ post.name } TWEET ERROR: `, err);
                            reject(err);
                        }
                        console.log(`${ post.name } TWEET: `, tweet.text);  // Tweet body.
                        resolve();
                    })
                }
            })
            .catch(err => {
                console.log(`TwITTER ${ post.name } error: `, err);
                reject(err);
            })
    })    
}

module.exports = { tweet }