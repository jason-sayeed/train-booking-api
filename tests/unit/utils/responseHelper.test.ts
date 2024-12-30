import {
  sendSuccess,
  sendError,
} from '../../../src/utils/responseHelper';
import { Response } from 'express';

describe('responseHelper', (): void => {
  let res: Partial<Response>;

  beforeEach((): void => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  type MockDataType = { message: string };

  describe('sendSuccess', (): void => {
    it('should call res.status() with the default 200 status code', (): void => {
      const mockData: MockDataType = {
        message: 'Success',
      };

      sendSuccess(res as Response, mockData);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should call res.status() with a custom status code', (): void => {
      const mockData: MockDataType = {
        message: 'Resource created',
      };
      const customStatusCode: number = 201;

      sendSuccess(
        res as Response,
        mockData,
        customStatusCode,
      );

      expect(res.status).toHaveBeenCalledWith(
        customStatusCode,
      );
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  });

  describe('sendError', (): void => {
    it('should call res.status() with the default 400 status code', (): void => {
      const mockErrorMessage: string = 'Bad Request';

      sendError(res as Response, mockErrorMessage);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: mockErrorMessage,
      });
    });

    it('should call res.status() with a custom status code', (): void => {
      const mockErrorMessage: string = 'Not Found';
      const customStatusCode: number = 404;

      sendError(
        res as Response,
        mockErrorMessage,
        customStatusCode,
      );

      expect(res.status).toHaveBeenCalledWith(
        customStatusCode,
      );
      expect(res.json).toHaveBeenCalledWith({
        error: mockErrorMessage,
      });
    });
  });
});
