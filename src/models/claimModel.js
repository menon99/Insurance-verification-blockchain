const mongoose = require('mongoose');

const claimSchema = mongoose.Schema({
    policy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Policy',
    },
    status: {
        type: String,
        default: 'Pending verification',
    },
    verified: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    policeVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    hospitalVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    bankVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    companyVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
});

claimSchema.virtual('blocks', {
    ref: 'Block',
    localField: '_id',
    foreignField: 'claim',
});

const Claim = mongoose.model('Claim', claimSchema);

module.exports = Claim;