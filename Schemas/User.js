const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    }
}, {
    timestamps: true
});


const User = mongoose.model('User', UserSchema);

module.exports = User