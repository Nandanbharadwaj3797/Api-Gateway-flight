const { StatusCodes } = require('http-status-codes');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const{UserService}=require('../services');

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

async function checkAuth(req, res, next) {
   try {
         const response =await UserService.isAuthenticated(req.headers['x-access-token']);
         if(response) {
            req.user = response;  // Attach user ID to request object
            next();
         }
    } catch (error) {
        return res
        .status(error.statusCode)
        .json(error);
        
    }
}

module.exports = {
    validateAuthRequest,
    checkAuth
};
