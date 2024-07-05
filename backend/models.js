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

const relationshipSchema = new mongoose.Schema({
    type: String,
    name: String,
    since: Date,
    details: {
        gender: String,
        age: Number,
        birthday: Date
    }
});

const childSchema = new mongoose.Schema({
    gender: String,
    name: String,
    age: Number,
    birthday: Date
});

const petSchema = new mongoose.Schema({
    type: String,
    name: String
});

const jobSchema = new mongoose.Schema({
    title: String,
    company: String,
    startDate: Date,
    endDate: Date,
    isCurrent: Boolean
});

const avatarSchema = new mongoose.Schema({
    name: String,
    picture: String,
    age: Number,
    birthday: Date,
    hobbies: String,
    education: String,
    career: [String],
    maritalStatus: String,
    children: [childSchema],
    pets: [petSchema],
    personality: String,
    specialNotes: String,
    jobs: [jobSchema],
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
    relationships: [relationshipSchema],
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