const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const auth = require('./middleware/auth');
const crypto = require('crypto');
const { User, Avatar, Message, FriendRequest, Friend } = require('./models');
const { spawn } = require('child_process');
const textGeneratorPath = path.resolve(__dirname, '../nlp/sentiment_analysis/pipeline1/generate_final_goal.py');
const routineItems = require('./routineItems');
const moment = require('moment');


const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Set the limit to 50MB
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Set the limit to 50MB for URL encoded data

const mongoUri = 'mongodb://localhost:27017/virtual-memorial-world';
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// Fetch memories for a specific avatar
app.get('/api/avatars/:id/memories', auth, async (req, res) => {
    try {
        const avatarId = req.params.id;
        const avatar = await Avatar.findById(avatarId).select('memories');
        if (!avatar) {
            return res.status(404).send('Avatar not found');
        }
        res.json({ memories: avatar.memories }); // Ensure the response includes the memories key
    } catch (error) {
        console.error('Error fetching memories:', error);
        res.status(500).send('Server error');
    }
});

// Fetch soundtracks for a specific avatar
app.get('/api/avatars/:id/soundtracks', auth, async (req, res) => {
    try {
        const avatarId = req.params.id;
        const avatar = await Avatar.findById(avatarId).select('soundtracks');
        if (!avatar) {
            return res.status(404).send('Avatar not found');
        }
        res.json({ soundtracks: avatar.soundtracks.map(track => track.file) }); // Ensure the response includes the soundtracks key
    } catch (error) {
        console.error('Error fetching soundtracks:', error);
        res.status(500).send('Server error');
    }
});

// Verify security question and reset password
app.post('/api/reset-password-with-security-question', async (req, res) => {
    const { username, securityAnswer, newPassword } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).send({ message: 'User not found' });
    }
    if (user.securityAnswer !== securityAnswer) {
        return res.status(400).send({ message: 'Incorrect security answer' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.send({ message: 'Password has been reset' });
});

// Reset password using token
app.post('/api/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Verify the token
        const decoded = jwt.verify(token, 'your_jwt_secret');
        const userId = decoded.userId;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Hash the new password
        user.password = await bcrypt.hash(password, 10);

        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get messages between two users
app.get('/api/messages/:recipientId', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.userId, receiver: req.params.recipientId },
                { sender: req.params.recipientId, receiver: req.user.userId }
            ]
        }).sort('createdAt');
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Get user by ID
app.get('/api/users/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('username');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

//get all users who chatted with you
app.get('/api/chat-users', auth, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Find unique chat users (both sender and receiver)
        const messages = await Message.find({
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        }).populate('sender receiver', 'username');

        // Create a unique list of chat users
        const chatUsersSet = new Set();
        messages.forEach(message => {
            if (message.sender._id.toString() !== userId) {
                chatUsersSet.add(JSON.stringify(message.sender));
            }
            if (message.receiver._id.toString() !== userId) {
                chatUsersSet.add(JSON.stringify(message.receiver));
            }
        });

        const chatUsers = Array.from(chatUsersSet).map(user => JSON.parse(user));

        res.json(chatUsers);
    } catch (error) {
        console.error('Error fetching chat users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Send a new message
app.post('/api/messages', auth, async (req, res) => {
    const { recipientId, content } = req.body;

    try {
        const newMessage = new Message({
            sender: req.user.userId,
            receiver: recipientId,
            content,
        });
        await newMessage.save();

        // Ensure only the latest 15 messages are stored
        await Message.deleteMany({
            $or: [
                { sender: req.user.userId, receiver: recipientId },
                { sender: recipientId, receiver: req.user.userId }
            ],
            _id: {
                $nin: (await Message.find({
                    $or: [
                        { sender: req.user.userId, receiver: recipientId },
                        { sender: recipientId, receiver: req.user.userId }
                    ]
                }).sort({ createdAt: -1 }).limit(15)).map(m => m._id)
            }
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message' });
    }
});

// Add the friend request route
app.post('/api/friend-request', auth, async (req, res) => {
    const { receiverId } = req.body;
    const senderId = req.user.userId;

    try {
        // Check if a friend request already exists
        const existingRequest = await FriendRequest.findOne({ sender: senderId, receiver: receiverId });
        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already sent.' });
        }

        const newFriendRequest = new FriendRequest({
            sender: senderId,
            receiver: receiverId,
        });
        await newFriendRequest.save();

        res.status(200).json({ message: 'Sent' });
    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get friend requests for the logged-in user
app.get('/api/friend-requests', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const friendRequests = await FriendRequest.find({ receiver: userId })
            .populate('sender', 'username')
            .populate('receiver', 'username');
        res.json(friendRequests);
    } catch (error) {
        console.error('Error fetching friend requests:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Handle accepting or declining a friend request
app.post('/api/friend-request/respond', auth, async (req, res) => {
    const { requestId, action } = req.body;

    try {
        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found.' });
        }

        if (action === 'accept') {
            friendRequest.status = 'accepted';

            // Create a new entry in the Friend collection
            const newFriend = new Friend({
                user1: friendRequest.sender,
                user2: friendRequest.receiver,
            });
            await newFriend.save();
        } else if (action === 'decline') {
            friendRequest.status = 'rejected';
        } else {
            return res.status(400).json({ message: 'Invalid action.' });
        }

        await friendRequest.save();

        // Optionally, you can delete the request from the database
        await FriendRequest.findByIdAndDelete(requestId);

        res.status(200).json({ message: `Friend request ${action}ed successfully.` });
    } catch (error) {
        console.error(`Error ${action}ing friend request:`, error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get accepted friends for the logged-in user
app.get('/api/friends', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const friends = await Friend.find({
            $or: [{ user1: userId }, { user2: userId }]
        }).populate('user1 user2', 'username');

        const friendList = friends.map(friend => {
            return friend.user1._id.toString() === userId ? friend.user2 : friend.user1;
        });

        res.json(friendList);
    } catch (error) {
        console.error('Error fetching accepted friends:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Function to execute the Python script and get the generated goal
const generateGoalText = () => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python3', [textGeneratorPath, "Tell me about your goals."]); //python

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

// Generate a new routine for a specific avatar
app.post('/api/generate-new-routine', auth, async (req, res) => {
    const { avatarId } = req.body;
    try {
        // Generate multiple routine items
        const newRoutineItems = [];
        const numItems = 5; // Number of routine items to add
        const usedIndexes = new Set();

        while (newRoutineItems.length < numItems && usedIndexes.size < routineItems.length) {
            const randomIndex = Math.floor(Math.random() * routineItems.length);
            if (!usedIndexes.has(randomIndex)) {
                usedIndexes.add(randomIndex);
                const newRoutineItem = routineItems[randomIndex];
                newRoutineItems.push({ event: newRoutineItem.event, time: newRoutineItem.time });
            }
        }

        // Sort the routine items by time
        newRoutineItems.sort((a, b) => moment(a.time, 'hh:mm A').isBefore(moment(b.time, 'hh:mm A')) ? -1 : 1);

        // Print the generated and sorted routine items for debugging
        console.log('Generated and sorted routine items:', newRoutineItems);

        if (newRoutineItems.length === 0) {
            console.error('Failed to generate routine.');
            return res.status(500).send({ error: 'Generated routine could not be retrieved.' });
        }

        const updateResult = await Avatar.findOneAndUpdate(
            { _id: avatarId },
            {
                $set: {
                    dailyRoutine: newRoutineItems
                }
            },
            { new: true, runValidators: true }
        );

        if (!updateResult) {
            return res.status(404).send({ error: 'Avatar not found' });
        }

        console.log(`New routine generated and saved for avatar ${avatarId}`);
        res.status(200).send({ message: 'New routine generated successfully.' });
    } catch (error) {
        console.error(`Error generating new routine for avatar ${avatarId}:`, error);
        res.status(500).send({ error: 'Error generating new routine.' });
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



// Register user
app.post('/api/register', async (req, res) => {
    const { username, email, password, securityQuestions } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        username,
        email,
        password: hashedPassword,
        securityQuestions
    });
    try {
        await user.save();
        res.send({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error registering:', error);
        res.status(500).send('Error registering user');
    }
});

app.post('/api/avatars/:id/memories', auth, async (req, res) => {
    const { id } = req.params;
    const { title, photos, soundtrack } = req.body;

    try {
        const avatar = await Avatar.findById(id);
        if (!avatar) {
            return res.status(404).send('Avatar not found');
        }

        const memory = {
            title,
            photos,
        };

        avatar.memories.push(memory);

        if (soundtrack) {
            const soundtrackData = {
                title,
                file: soundtrack,
                duration: 45
            };
            avatar.soundtracks.push(soundtrackData);

            // Log the soundtrack data inside the if block
            console.log('Soundtrack added:', soundtrackData);
        }

        // Log the memory data
        console.log('Memory added:', memory);

        await avatar.save();
        res.status(201).json(avatar);
    } catch (error) {
        console.error('Error adding memory:', error);
        res.status(500).send('Server error');
    }
});



// Verify security questions
app.post('/api/request-security-question', async (req, res) => {
    const { username, answers } = req.body;

    console.log('Request received with username:', username);
    console.log('Request received with answers:', answers);

    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found');
            return res.status(400).json({ message: 'User not found' });
        }

        console.log('User found:', user);

        const areAnswersCorrect = user.securityQuestions.every((question, index) => {
            return question.answer === answers[index];
        });

        console.log('Are answers correct:', areAnswersCorrect);

        if (!areAnswersCorrect) {
            console.log('Security answers are incorrect');
            return res.status(400).json({ message: 'Security answers are incorrect' });
        }

        // Generate a token for resetting the password
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        // Log the token
        console.log('Generated token:', token);

        // Respond with the token
        res.status(200).json({ message: 'Security questions answered correctly', token });
    } catch (error) {
        console.error('Error verifying security questions:', error);
        res.status(500).json({ message: 'Server error' });
    }
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
        relationships,
        userId: req.user.userId
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

//get avatars under certain person's creation for profile.js
app.get('/api/user-avatars', auth, async (req, res) => {
    try {
        const avatars = await Avatar.find({ userId: req.user.userId });
        res.send(avatars);
    } catch (error) {
        console.error('Error fetching user avatars:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all avatars
app.get('/api/avatars', auth, async (req, res) => {
    try {
        const avatars = await Avatar.find().populate('userId', 'username');
        res.send(avatars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
    console.log('Profile route handler called'); // Log to confirm route handler is called
    try {
        const user = await User.findById(req.user.userId).select('username email');
        if (!user) {
            console.log('User not found'); // Log if user not found
            return res.status(404).send('User not found');
        }
        console.log('User fetched:', user); // Log the user object
        res.send(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).send('Server error');
    }
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


app.put('/api/save-avatar-customization/:id', auth, async (req, res) => {
    try {
        const avatarId = req.params.id;
        const { avatarProps } = req.body;

        const avatar = await Avatar.findByIdAndUpdate(
            avatarId,
            { $set: avatarProps },
            { new: true }
        );

        if (!avatar) {
            return res.status(404).json({ message: 'Avatar not found' });
        }

        res.json(avatar);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
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

// Get avatar customization by id
app.get('/api/avatars/:id/customization', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const avatar = await Avatar.findById(id).select('topType accessoriesType hairColor facialHairType clotheType eyeType eyebrowType mouthType skinColor');
        if (!avatar) {
            return res.status(404).send('Avatar not found');
        }
        res.send(avatar);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/save-avatar-customization/:id', auth, async (req, res) => {
    try {
        const avatarId = req.params.id;
        const { avatarProps } = req.body;

        const avatar = await Avatar.findByIdAndUpdate(
            avatarId,
            { $set: avatarProps },
            { new: true }
        );

        if (!avatar) {
            return res.status(404).json({ message: 'Avatar not found' });
        }

        res.json(avatar);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
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

