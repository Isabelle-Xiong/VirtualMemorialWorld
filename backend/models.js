const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, unique: true },
    password: String,
    email: { type: String, unique: true, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    isEmailVerified: { type: Boolean, default: false },
    securityQuestions: [
        {
            question: { type: String, required: true },
            answer: { type: String, required: true }
        }
    ]
});

const memorySchema = new Schema({
    title: { type: String, required: true },
    photos: [{ type: String }], // Store photo URLs or file paths
    createdAt: { type: Date, default: Date.now }
});

const soundtrackSchema = new Schema({
    title: { type: String, required: true },
    file: { type: String }, // Store soundtrack URL or file path
    duration: { type: Number, required: true }, // Store duration in seconds
    createdAt: { type: Date, default: Date.now }
});


const messageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
const friendRequestSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

friendRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

const friendSchema = new Schema({
    user1: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user2: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const relationshipSchema = new Schema({
    type: String,
    name: String,
    since: Date,
    details: {
        gender: String,
        age: Number,
        birthday: Date
    }
});

const childSchema = new Schema({
    gender: String,
    name: String,
    age: Number,
    birthday: Date
});

const petSchema = new Schema({
    type: String,
    name: String
});

const jobSchema = new Schema({
    title: String,
    company: String,
    startDate: Date,
    endDate: Date,
    isCurrent: Boolean
});

const avatarSchema = new Schema({
    name: { type: String, required: true },
    picture: { type: String, required: true },
    age: { type: Number, required: true },
    birthday: { type: Date, required: true },
    hobbies: { type: [String], required: true },
    education: { type: String, required: true },
    career: { type: [String], required: true },
    maritalStatus: { type: String, required: true },
    children: [childSchema],
    pets: [petSchema],
    personality: { type: [String], required: true },
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
    topType: { type: String, default: 'ShortHairShortFlat' },
    accessoriesType: { type: String, default: 'Blank' },
    hairColor: { type: String, default: 'BrownDark' },
    facialHairType: { type: String, default: 'Blank' },
    clotheType: { type: String, default: 'BlazerSweater' },
    eyeType: { type: String, default: 'Default' },
    eyebrowType: { type: String, default: 'Default' },
    mouthType: { type: String, default: 'Smile' },
    skinColor: { type: String, default: 'Light' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    memories: [memorySchema],
    soundtracks: [soundtrackSchema], 
});

// Pre-save middleware to slice the goals array to only keep the latest 5 goals
avatarSchema.pre('save', function (next) {
    if (this.goals.length > 5) {
        this.goals = this.goals.slice(-5);
    }
    next();
});

const User = mongoose.model('User', userSchema);
const Avatar = mongoose.model('Avatar', avatarSchema);
const Message = mongoose.model('Message', messageSchema);
const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);
const Friend = mongoose.model('Friend', friendSchema);


module.exports = { User, Avatar, Message, FriendRequest, Friend };