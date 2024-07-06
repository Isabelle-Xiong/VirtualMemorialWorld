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
    name: { type: String, required: true },
    picture: { type: String, required: true },
    age: { type: Number, required: true },
    birthday: { type: Date, required: true },
    hobbies: { type: [String], required: true }, // Updated to accept arrays of strings
    education: { type: String, required: true },
    career: { type: [String], required: true }, // Updated to accept arrays of strings
    maritalStatus: { type: String, required: true },
    children: [childSchema],
    pets: [petSchema],
    personality: { type: [String], required: true }, // Updated to accept arrays of strings
    specialNotes: String,
    goals: [
        {
            goal: String,
            status: String
        }
    ],
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
});

const User = mongoose.model('User', userSchema);
const Avatar = mongoose.model('Avatar', avatarSchema);

module.exports = { User, Avatar };