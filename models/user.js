const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: {
        type: String,
    },
    filename: {
        type: String,
    }
})

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    image: imageSchema
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);