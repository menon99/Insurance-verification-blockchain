const mongoose = require('mongoose');

const bankSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    assets: {
        type: Number,
        required: true,
    },
    activeLoans: {
        type: Number,
        required: false,
    },
    activeLoanAmounts: {
        type: Number,
        required: false
    },
    creditRating: {
        type: Number,
        required: true,
    },
});

const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank;