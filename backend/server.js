const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const auth = require('./middleware/auth');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { User, Avatar } = require('./models');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoUri = 'mongodb://localhost:27017/virtual-memorial-world';
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

function sendEmail(to, subject, text) {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to,
        subject,
        text
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

// Password reset request
app.post('/api/request-reset-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send('User not found');
    }
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    const resetLink = `http://localhost:3000/reset-password/${token}`;
    sendEmail(user.email, 'Password Reset', `Click here to reset your password: ${resetLink}`);
    res.send({ message: 'Password reset email sent' });
});

// Reset password
app.post('/api/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
        return res.status(400).send('Password reset token is invalid or has expired');
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.send({ message: 'Password has been reset' });
});

// Register user
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const emailVerificationToken = crypto.randomBytes(20).toString('hex');
    const user = new User({
        username,
        password: hashedPassword,
        email,
        emailVerificationToken,
        emailVerificationExpires: Date.now() + 3600000 // 1 hour
    });
    await user.save();
    const verificationLink = `http://localhost:3000/verify-email/${emailVerificationToken}`;
    sendEmail(user.email, 'Email Verification', `Click here to verify your email: ${verificationLink}`);
    res.send(user);
});

// Verify email
app.get('/api/verify-email/:token', async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({ emailVerificationToken: token, emailVerificationExpires: { $gt: Date.now() } });
    if (!user) {
        return res.status(400).send('Email verification token is invalid or has expired');
    }
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    res.send({ message: 'Email has been verified' });
});

// Login user
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).send('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).send('Invalid password');
    }
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
    res.send({ token });
});

// Avatar CRUD operations
app.post('/api/avatars', auth, async (req, res) => {
    console.log('Received request:', req.body);
    const { name, picture, age, birthday, hobbies, education, career, maritalStatus, children, pets, personality, specialNotes, jobs = [] } = req.body;
    console.log('Jobs received:', jobs);
    // Create relationships from children and pets
    const relationships = [
        ...children.map(child => ({
            type: 'Child',
            name: child.name,
            since: new Date(),
            details: {
                gender: child.gender,
                age: child.age,
                birthday: child.birthday
            }
        })),
        ...pets.map(pet => ({
            type: 'Pet',
            name: pet.name,
            since: new Date(),
            details: {
                type: pet.type
            }
        }))
    ];  // Add job details
    const jobDetails = jobs.map(job => ({
        title: job.title,
        company: job.company,
        startDate: job.startDate ? new Date(job.startDate) : new Date(), // set startDate as current date if not provided
        endDate: job.endDate ? new Date(job.endDate) : null,
        isCurrent: job.isCurrent || false
    }));



    const avatar = new Avatar({
        name,
        picture,
        age,
        birthday,
        hobbies,
        education,
        career,
        maritalStatus,
        children,
        pets,
        personality,
        specialNotes,
        jobs: jobDetails,
        relationships
    });

    try {
        const savedAvatar = await avatar.save();
        res.json(savedAvatar);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get avatar by ID
app.get('/api/avatars', auth, async (req, res) => {
    const avatars = await Avatar.find();
    res.send(avatars);
});

app.put('/api/avatars/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { name, picture, age, birthday, hobbies, education, career, maritalStatus, children, pets, personality, specialNotes, jobs = [] } = req.body;

    // Update relationships from children and pets
    const relationships = [
        ...children.map(child => ({
            type: 'Child',
            name: child.name,
            since: new Date(),
            details: {
                gender: child.gender,
                age: child.age,
                birthday: child.birthday
            }
        })),
        ...pets.map(pet => ({
            type: 'Pet',
            name: pet.name,
            since: new Date(),
            details: {
                type: pet.type
            }
        }))
    ];

    // Add job details
    const jobDetails = jobs.map(job => ({
        title: job.title,
        company: job.company,
        startDate: job.startDate ? new Date(job.startDate) : new Date(), // set startDate as current date if not provided
        endDate: job.endDate ? new Date(job.endDate) : null,
        isCurrent: job.isCurrent || false
    }));


    try {
        const avatar = await Avatar.findByIdAndUpdate(id, {
            name,
            picture,
            age,
            birthday,
            hobbies,
            education,
            career,
            maritalStatus,
            children,
            pets,
            personality,
            specialNotes,
            jobs: jobDetails,
            relationships
        }, { new: true });
        res.send(avatar);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/avatars/:id', auth, async (req, res) => {
    const { id } = req.params;
    await Avatar.findByIdAndDelete(id);
    res.send({ message: 'Avatar deleted' });
});

app.get('/api/profile', auth, async (req, res) => {
    const user = await User.findById(req.user.userId);
    res.send({ username: user.username });
});

app.put('/api/profile', auth, async (req, res) => {
    const { password, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).send('Invalid password');
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    res.send({ message: 'Password updated successfully' });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend2/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend2/build/index.html'));
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});