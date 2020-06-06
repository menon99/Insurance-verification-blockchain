const mongoose = require('mongoose');

const caseSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    description: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;