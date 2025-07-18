const { UserRepository , RoleRepository} = require('../repositories');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const { Auth , ENUMS} = require('../utils/common');


const userRepo = new UserRepository();
const roleRepo = new RoleRepository();

async function createUser(data) {
    try {
        const user = await userRepo.create(data);

        const role=await roleRepo.getRoleByName(ENUMS.USER_ROLES_ENUMS.CUSTOMER);

        user.addRole(role);
        return user;
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Something went wrong while creating user', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signin(data) {
    try {
        const user = await userRepo.getUserByEmail(data.email);
        if (!user) {
            throw new AppError('User not found for this email', StatusCodes.NOT_FOUND);
        }

        const passwordMatch = Auth.checkPassword(data.password, user.password);

        if (!passwordMatch) {
            throw new AppError('Invalid password', StatusCodes.UNAUTHORIZED);
        }

        const jwt = Auth.createToken({
            id: user.id,
            email: user.email
        });

        return jwt;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Something went wrong while signing in', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAuthenticated(token) {
    try {
        if (!token) {
            throw new AppError('Token is required', StatusCodes.BAD_REQUEST);
        }
        const response = Auth.verifyToken(token);
        const user = await userRepo.get(response.id);
        if (!user) {
            throw new AppError('User not found', StatusCodes.NOT_FOUND);
        }
        return user.id;
       
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        if(error.name === 'JsonWebTokenError') {
            throw new AppError('Invalid  JWT   token', StatusCodes.UNAUTHORIZED);
        }
        if(error.name === 'TokenExpiredError') {
            throw new AppError('JWT token has expired', StatusCodes.UNAUTHORIZED);
        }
        console.log("error", error);
        throw new AppError('Something went wrong while verifying token', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function addRoletoUser(data) {
    try{
        const user = await userRepo.get(data.id);
        if (!user) {
            throw new AppError('User not found', StatusCodes.NOT_FOUND);
        }
        const role = await roleRepo.getRoleByName(data.role);
        if (!role) {
            throw new AppError('Role not found', StatusCodes.NOT_FOUND);
        }
        user.addRole(role);
        return user;
    }catch(error){
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Something went wrong while adding role to user', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAdmin(id) {
  try {
    const user = await userRepo.get(id);
    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }

    const adminRole = await roleRepo.getRoleByName(ENUMS.USER_ROLES_ENUMS.ADMIN);
    if (!adminRole) {
      throw new AppError('No role found for ADMIN', StatusCodes.NOT_FOUND);
    }

    const hasAdminRole = await user.hasRole(adminRole);
    return hasAdminRole;
  } catch (error) {
    console.error("Error in isAdmin:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Something went wrong while checking admin status', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
    createUser,
    signin,
    isAuthenticated,
    addRoletoUser,
    isAdmin
};
