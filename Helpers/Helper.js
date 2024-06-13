const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRETKEY;

function generateToken(payload) {
    const token = jwt.sign(payload, secretKey);
    return token;
}

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return null;
    }
}

module.exports = {generateToken,verifyToken}