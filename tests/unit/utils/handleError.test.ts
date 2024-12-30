import { Response } from 'express';
import { handleError } from '../../../src/utils/handleError';
import { sendError } from '../../../src/utils/responseHelper';

jest.mock('../../../src/utils/responseHelper', () => ({
  sendError: jest.fn(),
}));

type TestError =
  | Error
  | string
  | number
  | null
  | undefined
  | Record<string, unknown>;

describe('handleError', (): void => {
  let res: Partial<Response>;

  beforeEach((): void => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  it('should call sendError with the error message if error is an instance of Error', (): void => {
    const error: TestError = new Error(
      'Something went wrong',
    );
    handleError(res as Response, error);

    expect(sendError).toHaveBeenCalledWith(
      res,
      'Something went wrong',
      400,
    );
  });

  it('should call sendError with "An unknown error occurred" if error is not an instance of Error', (): void => {
    const error: TestError = 'Some random string';
    handleError(res as Response, error);

    expect(sendError).toHaveBeenCalledWith(
      res,
      'An unknown error occurred',
      400,
    );
  });

  it('should call sendError with "An unknown error occurred" if error is null', (): void => {
    const error: TestError = null;
    handleError(res as Response, error);

    expect(sendError).toHaveBeenCalledWith(
      res,
      'An unknown error occurred',
      400,
    );
  });

  it('should call sendError with "An unknown error occurred" if error is undefined', (): void => {
    const error: TestError = undefined;
    handleError(res as Response, error);

    expect(sendError).toHaveBeenCalledWith(
      res,
      'An unknown error occurred',
      400,
    );
  });

  it('should call sendError with "An unknown error occurred" if error is a number', (): void => {
    const error: TestError = 42;
    handleError(res as Response, error);

    expect(sendError).toHaveBeenCalledWith(
      res,
      'An unknown error occurred',
      400,
    );
  });

  it('should call sendError with "An unknown error occurred" if error is an object that is not an instance of Error', (): void => {
    const error: TestError = {
      message: 'Not an Error instance',
    };
    handleError(res as Response, error);

    expect(sendError).toHaveBeenCalledWith(
      res,
      'An unknown error occurred',
      400,
    );
  });
});
