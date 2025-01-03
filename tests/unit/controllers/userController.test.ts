import { Request, Response } from 'express';
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from '../../../src/controllers/userController';
import User from '../../../src/models/userModel';
import { hashPassword } from '../../../src/utils/hashPassword';
import {
  sendError,
  sendSuccess,
} from '../../../src/utils/responseHelper';
import {
  createRequest,
  createResponse,
} from 'node-mocks-http';

jest.mock('../../../src/models/userModel');
jest.mock('../../../src/utils/hashPassword');
jest.mock('../../../src/utils/responseHelper');

let req: Request;
let res: Response;
let next: jest.Mock;

beforeEach((): void => {
  req = createRequest();
  res = createResponse();
  next = jest.fn();

  jest.clearAllMocks();
});

type MockUserType = {
  _id: string;
  name: string;
  email: string;
  password: string;
};

describe('User Controller', (): void => {
  describe('createUser', (): void => {
    it('should hash the password and create a user', async (): Promise<void> => {
      req.body = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser: MockUserType = {
        _id: 'userId123',
        ...req.body,
      };

      (hashPassword as jest.Mock).mockResolvedValue(
        'hashedPassword',
      );
      (User.create as jest.Mock).mockResolvedValue(
        mockUser,
      );

      await createUser(req, res, next);

      expect(hashPassword).toHaveBeenCalledWith(
        'password123',
      );
      expect(User.create).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'test@example.com',
        password: 'hashedPassword',
      });
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        mockUser,
        201,
      );
    });

    it('should handle duplicate email error', async (): Promise<void> => {
      req.body = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
      };

      (User.findOne as jest.Mock).mockResolvedValue({
        _id: 'userId123',
        name: 'John Doe',
        email: 'test@example.com',
        password: 'hashedPassword',
      });

      await createUser(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(sendError).toHaveBeenCalledWith(
        res,
        'Email already exists',
        400,
      );
    });
  });

  describe('getUser', (): void => {
    it('should return a user by ID', async (): Promise<void> => {
      req.params.id = 'userId123';
      const mockUser: { id: string; name: string } = {
        id: 'userId123',
        name: 'John Doe',
      };

      (User.findById as jest.Mock).mockResolvedValue(
        mockUser,
      );

      await getUser(req, res, next);

      expect(User.findById).toHaveBeenCalledWith(
        'userId123',
      );
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        mockUser,
      );
    });

    it('should return an error if user is not found', async (): Promise<void> => {
      req.params.id = 'userId123';
      (User.findById as jest.Mock).mockResolvedValue(null);

      await getUser(req, res, next);

      expect(sendError).toHaveBeenCalledWith(
        res,
        'User not found',
        404,
      );
    });
  });

  describe('updateUser', (): void => {
    it('should hash the password if provided', async (): Promise<void> => {
      req.params.id = 'userId123';
      req.body = { password: 'new-password' };
      (hashPassword as jest.Mock).mockResolvedValue(
        'hashedPassword',
      );
      (
        User.findByIdAndUpdate as jest.Mock
      ).mockResolvedValue({});

      await updateUser(req, res, next);

      expect(hashPassword).toHaveBeenCalledWith(
        'new-password',
      );
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        'userId123',
        { password: 'hashedPassword' },
        { new: true, runValidators: true },
      );
      expect(sendSuccess).toHaveBeenCalled();
    });

    it('should return an error if user is not found', async (): Promise<void> => {
      req.params.id = 'userId123';
      (
        User.findByIdAndUpdate as jest.Mock
      ).mockResolvedValue(null);

      await updateUser(req, res, next);

      expect(sendError).toHaveBeenCalledWith(
        res,
        'User not found',
        404,
      );
    });
  });

  describe('deleteUser', (): void => {
    it('should delete a user by ID', async (): Promise<void> => {
      req.params.id = 'userId123';
      (
        User.findByIdAndDelete as jest.Mock
      ).mockResolvedValue({});

      await deleteUser(req, res, next);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith(
        'userId123',
      );
      expect(sendSuccess).toHaveBeenCalledWith(res, {
        message: 'User successfully deleted',
      });
    });

    it('should return an error if user is not found', async (): Promise<void> => {
      req.params.id = 'userId123';
      (
        User.findByIdAndDelete as jest.Mock
      ).mockResolvedValue(null);

      await deleteUser(req, res, next);

      expect(sendError).toHaveBeenCalledWith(
        res,
        'User not found',
        404,
      );
    });
  });
});
