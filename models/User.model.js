const mongoose = require('mongoose');

const userShcema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        set: (v) => v.toUpperCase(),
        validate: {
            validator: function (v) {
                // Reject emojis and anything not A-Z or space
                return /^[A-Z\s]+$/.test(v.toUpperCase());
            },
            message: props => `${props.value} is not a valid name. Only uppercase alphabets and spaces are allowed.`
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],

    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    password: {
        type: String,
        required: true,

    },
    role: {
        type: String,
        enum: ['user', 'doctor', 'admin'],
        default: 'user',
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
    otp: {
        type: Number,
    },
    otpExpires: {
        type: Date,
    },
    profilePicture: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    },
    

    isVerified: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

}, { timestamps: true });
module.exports = new mongoose.model('User', userShcema);