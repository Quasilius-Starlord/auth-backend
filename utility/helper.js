const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./constants')
const generateToken = ({
    email,
    password
}) => {
    const payload = { password, email };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 });
};

const verifyToken = async (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            throw new Error('Invalid token');
        }
        return decoded;
    } catch (error) {
        throw error;
    }
};

const hashPassword = async (password) => {
    const saltRounds = 2;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
};

module.exports = {
    generateToken,
    hashPassword,
    comparePassword,
    verifyToken
}