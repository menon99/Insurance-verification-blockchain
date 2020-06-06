const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const types = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: {
        type: types.String,
        trim: true,
        default: 'Anonymous',
    },
    userType: {
        type: types.String,
        trim: true,
        default: 'user',
    },
    email: {
        type: types.String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error('Not a valid email');
        },
    },
    password: {
        type: types.String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) throw new Error('password should not be "password"');
        }
    },
});

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email: email });
    if (!user)
        throw new Error('Unable to login');
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
        throw new Error('Unable to login');
    else
        return user;
};

userSchema.virtual('claims', {
    ref: 'Claim',
    localField: '_id',
    foreignField: 'user',
});

userSchema.virtual('policies', {
    ref: 'Policy',
    localField: '_id',
    foreignField: 'user',
});

userSchema.virtual('cases', {
    ref: 'Case',
    localField: '_id',
    foreignField: 'user',
});

userSchema.virtual('medicals', {
    ref: 'Medical',
    localField: '_id',
    foreignField: 'user',
});

userSchema.virtual('banks', {
    ref: 'Bank',
    localField: '_id',
    foreignField: 'user',
});

userSchema.pre('save', async function() {
    this.password = await bcrypt.hash(this.password, 8);
});

const User = mongoose.model('User', userSchema);
module.exports = User;