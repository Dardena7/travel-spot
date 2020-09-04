const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    author: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    picture: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: new Date() }
});

module.exports = mongoose.model('Post', postSchema);