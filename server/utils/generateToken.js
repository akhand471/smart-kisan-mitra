const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT token for the given user ID.
 * @param {string} id - MongoDB User document _id
 * @returns {string} JWT token string
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

module.exports = generateToken;
