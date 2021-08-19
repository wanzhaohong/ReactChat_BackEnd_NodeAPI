const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
},
{timestamps: true}
);

module.exports = mongoose.model('Users', UserSchema);