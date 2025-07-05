const{UserRepository} = require('../repositories');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');

const userRepo= new UserRepository();

async function createUser(data) {
    try {
        const user = await userRepo.create(data);
        return user;
    } catch (error) {
        let explanation=[];
        error.errors.forEach((err) => {
            explanation.push(err.message);
        });
        throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }
    throw new AppError('User creation failed', StatusCodes.INTERNAL_SERVER_ERROR);
}