const mongoose = require("mongoose");

const blockSchema = mongoose.Schema({
    policeVerified: {
        type: String,
        required: true,
        default: 'Pending',
    },
    hospitalVerified: {
        type: String,
        required: true,
        default: 'Pending',
    },
    bankVerified: {
        type: String,
        required: true,
        default: 'Pending',
    },
    companyVerified: {
        type: String,
        required: true,
        default: 'Pending',
    },
    claim: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Claim",
    }
}, {
    timestamps: true,
});

const Block = mongoose.model("Block", blockSchema);

module.exports = Block;