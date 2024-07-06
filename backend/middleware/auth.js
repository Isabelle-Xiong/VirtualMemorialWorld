const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        console.error('Access denied. No token provided.');
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, '0c9ba86d05cf471ece1afca5997f769a2683d6b356f5aa5cdea6d03b644e6f81');
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Invalid token:', err);
        res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = auth;