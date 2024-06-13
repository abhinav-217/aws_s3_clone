const jwt = require("jsonwebtoken");

function generateToken(payload,secretKey = process.env.JWT_SECRETKEY) {
    const token = jwt.sign(payload, secretKey);
    return token;
}

function verifyToken(token,secretKey = process.env.JWT_SECRETKEY) {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return {is_valid_client:false};
    }
}

module.exports = {generateToken,verifyToken}