const { StatusCodes } = require('http-status-codes');
const { UserService } = require('../services');
const AppError = require('../utils/errors/app-error');

/*
POST: /signup
req.body = { email: "", password: "" }
*/
async function createUser(req, res) {
    console.log("Incoming body:", req.body);
    try {
        const user = await UserService.createUser({
            email: req.body.email,
            password: req.body.password
        });

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "User created successfully",
            data: user,
            error: {}
        });
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to create user",
            data: {},
            error: error.explanation || error.message
        });
    }
}

/*
POST: /signin
req.body = { email: "", password: "" }
*/
async function signin(req, res) {
    try {
        const token = await UserService.signin({
            email: req.body.email,
            password: req.body.password
        });

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Login successful",
            data: token,
            error: {}
        });
    } catch (error) {
        console.log("Error in signin:", error);
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Login failed",
            data: {},
            error: error.explanation || error.message
        });
    }
}

module.exports = {
    createUser,
    signin
};
