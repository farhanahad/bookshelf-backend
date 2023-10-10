import httpStatus from 'http-status';
import sendResponse from '../../../shared/responseData';
import { IUser } from './user.interface';
import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import { UserService } from './user.service';

const createUserToDB = catchAsync(async (req: Request, res: Response) => {
  const { ...userData } = await req.body;

  const result = await UserService.createUser(userData);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

export const UserController = {
  createUserToDB,
};
