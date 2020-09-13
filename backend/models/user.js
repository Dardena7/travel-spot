const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
mongoose.set('useCreateIndex', true);

const userSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    picture: {type: String, default: 'http://localhost:3000/images/profil-default.png'}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);