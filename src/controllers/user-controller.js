const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const { UserService } = require('../services');
const { ErrorResponse, SuccessResponse } = require('../utils/common');

/*
POST: /signup
req.body = { email: "", password: "" }
*/

async function createUser(req, res, next) {
    console.log("Incoming body:", req.body);
    try {
        const user = await UserService.createUser({
            email: req.body.email,
            password: req.body.password
        });

        return res.status(StatusCodes.CREATED).json({
            ...SuccessResponse,
            data: user
        });
    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            ...ErrorResponse,
            error: error.explanation || error.message
        });
    }
}

module.exports = {
    createUser
};
