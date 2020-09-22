const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const postSchema = new Schema({
    url: String,
    public_id: String,
    description: String,
    date: Date
});

const Post = mongoose.model("Post", postSchema);

module.exports = { Post };
