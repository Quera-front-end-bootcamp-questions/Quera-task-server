import { Response } from 'express';

interface ResponseData<T> {
  message: string;
  code: number;
  error: boolean;
  data: T;
}

export const sendResponse = <T>(res: Response, statusCode: number, data?: any, message?: string) => {
  const responseData: ResponseData<T> = {
    message: message || '',
    code: statusCode,  
    error: (statusCode <400 && statusCode > 199) ? false : true,
    data: data || null
  };
  return res.status(statusCode).send(responseData);
};
