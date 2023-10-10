export type ILoginUser = {
  email: string;
  password: string;
};

export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
  user: ILoginUser;
};

export type IRefreshTokenResponse = {
  accessToken: string;
  user?: ILoginUser;
};
