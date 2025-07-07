const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { serverConfig } = require('../../config');

function checkPassword(plainPassword, encryptedPassword) {
    try {
        return bcrypt.compareSync(plainPassword, encryptedPassword); // ✅ Synchronous
    } catch (error) {
        console.error("Error while checking password:", error);
        throw error;
    }
}

function createToken(input) {
    try {
        return jwt.sign(input, serverConfig.JWT_SECRET, {
            expiresIn: serverConfig.JWT_EXPIRATION_TIME || '1h'
        });
    } catch (error) {
        console.error("Error while creating token:", error);
        throw error;
    }
}

module.exports = {
    checkPassword,
    createToken
};
