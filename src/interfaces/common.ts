import { IErrorMessage } from './error';

export type IErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IErrorMessage[];
};

export type IGenericPagination<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};
