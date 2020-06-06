const mongoose = require('mongoose');

const policyScheme = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    policyName: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    expiry: {
        type: Date,
        required: true,
    }
});

const Policy = mongoose.model('Policy', policyScheme);
module.exports = Policy;