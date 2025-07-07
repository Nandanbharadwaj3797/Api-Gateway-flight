const { StatusCodes } = require('http-status-codes');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');

function validateAuthRequest(req, res, next) {
    if (!req.body?.email) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            ...ErrorResponse,
            message: "Validation error: Email is required",
            error: new AppError(
                ["Email is not found in the incoming request in the correct form"],
                StatusCodes.BAD_REQUEST
            )
        });
    }

    if (!req.body?.password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            ...ErrorResponse,
            message: "Validation error: Password is required",
            error: new AppError(
                ["Password is not found in the incoming request in the correct form"],
                StatusCodes.BAD_REQUEST
            )
        });
    }

    next();
}

module.exports = {
    validateAuthRequest
};
