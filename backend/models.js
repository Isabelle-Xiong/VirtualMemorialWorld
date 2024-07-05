const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    email: { type: String, unique: true, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    isEmailVerified: { type: Boolean, default: false }
});

const avatarSchema = new mongoose.Schema({
    name: String,
    picture: String,
    age: Number,
    hobbies: String,
    education: String,
    career: String,
    maritalStatus: String,
    children: String,
    pets: String,
    personality: String,
    specialNotes: String,
    jobs: [
        {
            title: String,
            company: String,
            startDate: Date,
            endDate: Date,
            isCurrent: Boolean
        }
    ],
    dailyRoutine: [
        {
            time: String,
            event: String
        }
    ],
    progressionLog: [
        {
            date: Date,
            statement: String
        }
    ],
    relationships: [
        {
            type: String,
            name: String,
            since: Date
        }
    ],
    goals: [
        {
            goal: String,
            status: String
        }
    ]
});

const User = mongoose.model('User', userSchema);
const Avatar = mongoose.model('Avatar', avatarSchema);

module.exports = { User, Avatar };