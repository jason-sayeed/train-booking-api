import {
  sendSuccess,
  sendError,
} from '../../src/utils/responseHelper';
import { Response } from 'express';

describe('responseHelper', () => {
  let res: Partial<Response>;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('sendSuccess', () => {
    it('should call res.status() with the default 200 status code', () => {
      const mockData = { message: 'Success' };

      sendSuccess(res as Response, mockData);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should call res.status() with a custom status code', () => {
      const mockData = { message: 'Resource created' };
      const customStatusCode = 201;

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

  describe('sendError', () => {
    it('should call res.status() with the default 400 status code', () => {
      const mockErrorMessage = 'Bad Request';

      sendError(res as Response, mockErrorMessage);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: mockErrorMessage,
      });
    });

    it('should call res.status() with a custom status code', () => {
      const mockErrorMessage = 'Not Found';
      const customStatusCode = 404;

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
