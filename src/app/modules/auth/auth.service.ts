import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.constant';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await User.isUserExist(email);

  //check use existence
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
  }

  // create access token and refresh token

  const { email: contactEmail } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { email: contactEmail },
    config.jwt.access_secret as Secret,
    config.jwt.access_expired_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { email: contactEmail },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expired_in as string
  );

  return {
    accessToken,
    refreshToken,
    user: isUserExist,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token');
  }

  const { email: contactEmail } = verifiedToken;

  // checking deleted user's refresh token
  const isUserExist = await User.isUserExist(contactEmail);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // generate new token
  const { email } = isUserExist;

  const newAccessToken = jwtHelpers.createToken(
    { email },
    config.jwt.access_secret as Secret,
    config.jwt.access_expired_in as string
  );

  return {
    accessToken: newAccessToken,
    user: isUserExist,
  };
};

const logOut = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token');
  }

  const { email: contactEmail } = verifiedToken;

  // checking deleted user's refresh token
  const isUserExist = await User.isUserExist(contactEmail);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // generate new token
  const { email } = isUserExist;

  const newAccessToken = jwtHelpers.createToken(
    { email },
    config.jwt.access_secret as Secret,
    '0'
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
  logOut,
};
