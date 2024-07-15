const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    console.log('Auth middleware called'); // Log to confirm middleware is called
    const token = req.header('x-auth-token');
    if (!token) {
        console.error('Access denied. No token provided.');
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Ensure this secret key matches the one used during token generation
        console.log('Decoded JWT:', decoded); // Log the decoded token
        req.user = { userId: decoded.userId }; // Explicitly set req.user.userId
        next();
    } catch (err) {
        console.error('Invalid token:', err);
        res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = auth;