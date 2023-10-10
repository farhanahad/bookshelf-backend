import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { IUser } from './user.interface';
import { User } from './user.model';

const createUser = async (user: IUser): Promise<IUser | null> => {
  try {
    // default password
    if (!user.password) {
      user.password = config.default_user_pass as string;
    }

    const createdUser = await User.create(user);

    if (!createdUser) {
      throw new ApiError(400, 'Failed to create user');
    }

    // return createdUser;
    return User.findById(createdUser._id).select('-password').lean();
  } catch (error) {
    if ((error as any).code === 11000) {
      // Duplicate key error (if emaile is not unique)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email must be unique');
    }
    throw error;
  }
};

export const UserService = {
  createUser,
};
