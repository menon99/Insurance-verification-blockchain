const mongoose = require('mongoose');

const medicalSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    description: {
        type: String,
        required: true
    },
    billAmount: {
        type: Number,
        required: true,
    },
});

const Medical = mongoose.model('Medical', medicalSchema);

module.exports = Medical;