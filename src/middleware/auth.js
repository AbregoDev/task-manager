const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        // Extract token from header
        const token = req.header('Authorization').replace('Bearer ', '');
        // Verify if token is valid with JWT and return decoded token
        const decoded = jwt.verify(token, 'secret-word');
        // Search for user with _id and check if session is on
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        // Throw error if the user doesn't exists
        if (!user) { throw new Error(); }

        // Attach token and user to next request
        req.token = token;
        req.user = user;
        next();
    } catch(e) {
        res.status(401).send({ error: 'Unauthenticated user' });
    }
}

module.exports = auth;