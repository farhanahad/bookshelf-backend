import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AuthService } from './auth.service';
import config from '../../../config';
import sendResponse from '../../../shared/responseData';
import httpStatus from 'http-status';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.constant';

const loginUserToDB = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;

  const result = await AuthService.loginUser(loginData);

  const { refreshToken, ...others } = result;

  // set refresh cookies
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User successfully logged in!',
    data: others,
  });
});

const refreshTokenToDB = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = await req.cookies.refreshToken;

  const result = await AuthService.refreshToken(refreshToken);

  // set refresh token into cookie

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'New access token generated successfully !',
    data: result,
  });
});

const logOut = catchAsync(async (req: Request, res: Response) => {
  // const refreshToken = req?.headers?.authorization ?? '';
  const refreshToken = await req.cookies.refreshToken;

  const result = await AuthService.logOut(refreshToken);

  // set refresh cookies
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
    expires: new Date(0),
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logOut successfully!',
    data: result,
  });
});

export const AuthController = {
  loginUserToDB,
  refreshTokenToDB,
  logOut,
};
