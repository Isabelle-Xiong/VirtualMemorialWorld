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
const { spawn } = require('child_process');
const textGeneratorPath = path.resolve(__dirname, '../nlp/sentiment_analysis/pipeline1/generate_final_goal.py');


const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoUri = 'mongodb://localhost:27017/virtual-memorial-world';
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

// Function to execute the Python script and get the generated goal
const generateGoalText = () => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python3', [textGeneratorPath, "Tell me about your goals."]);

        let result = '';
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return reject(`Process exited with code: ${code}`);
            }
            const match = result.match(/Best Goal \(limited to 2 sentences\): (.+) \| Adjusted Score: .+/);
            if (match) {
                resolve(match[1]);
            } else {
                reject('No suitable goal found.');
            }
        });
    });
};


// Retry mechanism for generating goal text
const generateGoalWithRetries = async (retries = 3) => {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const goalText = await generateGoalText();
            if (goalText && goalText.trim() && goalText !== 'No suitable goal found') {
                return goalText;
            }
        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed:`, error);
        }
    }
    return null; // Return null if all retries fail
};


// Generate a new goal for a specific avatar
app.post('/api/generate-new-goal', auth, async (req, res) => {
    const { avatarId } = req.body;
    try {
        const newGoalText = await generateGoalWithRetries();

        if (!newGoalText) {
            console.error('Failed to generate goal after retries.');
            return res.status(500).send({ error: 'Generated goal could not be retrieved.' });
        }

        const updateResult = await Avatar.findOneAndUpdate(
            { _id: avatarId },
            {
                $push: {
                    goals: {
                        $each: [{ goal: newGoalText, status: 'Not Started' }],
                        $slice: -5
                    }
                }
            },
            { new: true, runValidators: true }
        );

        if (!updateResult) {
            return res.status(404).send({ error: 'Avatar not found' });
        }

        console.log(`New goal generated and saved for avatar ${avatarId}`);
        res.status(200).send({ message: 'New goal generated successfully.' });
    } catch (error) {
        console.error(`Error generating new goal for avatar ${avatarId}:`, error);
        res.status(500).send({ error: 'Error generating new goal.' });
    }
});

// Test endpoint to call the generateGoalText function
app.get('/api/test-generate-goal', async (req, res) => {
    try {
        const newGoalText = await generateGoalText();
        res.status(200).send({ newGoal: newGoalText });
    } catch (error) {
        console.error('Error generating goal text:', error);
        res.status(500).send({ error: 'Error generating goal text.' });
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


// Update goal statuses for a specific avatar
app.post('/api/update-goal-status', auth, async (req, res) => {
    const { avatarId } = req.body;
    try {
        const avatar = await Avatar.findById(avatarId);
        if (!avatar) {
            return res.status(404).send('Avatar not found');
        }
        avatar.goals.forEach((goal) => {
            if (goal.status === 'Not Started') {
                goal.status = 'In Progress';
            } else if (goal.status === 'In Progress') {
                goal.status = 'Completed';
            }
        });

        await avatar.save();
        console.log(`Goal statuses updated for avatar ${avatarId}`);
        res.status(200).send({ message: 'Goal statuses updated successfully.' });
    } catch (error) {
        console.error('Error updating goal statuses:', error);
        res.status(500).send({ error: 'Error updating goal statuses.' });
    }
});

// Generate a new goal for a specific avatar
app.post('/api/generate-new-goal', auth, async (req, res) => {
    const { avatarId } = req.body;
    try {
        const newGoalText = await generateGoalText().catch(error => {
            console.error('Error generating goal text:', error);
            return 'Generated goal could not be retrieved.';
        });

        if (!newGoalText) {
            return res.status(500).send({ error: 'Error generating new goal.' });
        }

        await Avatar.findOneAndUpdate(
            { _id: avatarId },
            {
                $push: { goals: { $each: [{ goal: newGoalText, status: 'Not Started' }], $slice: -5 } }
            }
        );

        console.log(`New goal generated and saved for avatar ${avatarId}`);
        res.status(200).send({ message: 'New goal generated successfully.' });
    } catch (error) {
        console.error(`Error generating new goal for avatar ${avatarId}:`, error);
        res.status(500).send({ error: 'Error generating new goal.' });
    }
});




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
    const { name, picture, age, birthday, hobbies, education, career, maritalStatus, children, pets, personality, specialNotes, goals = [], jobs = [] } = req.body;
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
    ];

    // Add job details
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
        goals,
        jobs: jobDetails,
        relationships
    });
    try {
        const savedAvatar = await avatar.save();
        console.log('Avatar saved:', savedAvatar);
        res.json(savedAvatar);
    } catch (error) {
        console.error('Error saving avatar:', error);
        if (error.name === 'ValidationError') {
            for (let field in error.errors) {
                console.error(`Validation error for ${field}: ${error.errors[field].message}`);
            }
        }
        res.status(400).json({ error: error.message });
    }
});
// Get avatar by id
app.get('/api/avatars/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const avatar = await Avatar.findById(id);
        if (!avatar) {
            return res.status(404).send('Avatar not found');
        }
        console.log('Avatar retrieved:', avatar); // Debug log
        res.send(avatar);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all avatars
app.get('/api/avatars', auth, async (req, res) => {
    const avatars = await Avatar.find();
    res.send(avatars);
});
app.put('/api/avatars/:id', auth, async (req, res) => {
    const { id } = req.params;
    const {
        name,
        picture,
        age,
        birthday,
        hobbies,
        education,
        career,
        maritalStatus,
        children = [],  // Provide default value
        pets = [],      // Provide default value
        personality,
        specialNotes,
        goals = [],     // Provide default value
        jobs = []       // Provide default value
    } = req.body;

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
            goals,
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

// Endpoint to update avatar's routine and relationships based on virtual time
app.post('/api/update-avatar-routine', auth, async (req, res) => {
    const { id, virtualTime } = req.body;
    try {
        const avatar = await Avatar.findById(id);
        if (!avatar) {
            return res.status(404).send('Avatar not found');
        }

        // Logic to update the avatar's routine and relationships
        // For example, we can add a log entry to the progressionLog
        avatar.progressionLog.push({
            date: new Date(),
            statement: `Routine and relationships updated at virtual time ${virtualTime}`
        });

        await avatar.save();
        res.send(avatar);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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