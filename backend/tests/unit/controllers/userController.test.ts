import { Request, Response } from 'express';
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
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

beforeEach(() => {
  req = createRequest();
  res = createResponse();
  next = jest.fn();

  jest.clearAllMocks();
});

describe('User Controller', () => {
  describe('createUser', () => {
    it('should return an error if required fields are missing', async () => {
      req.body = { email: 'test@example.com' };
      await createUser(req, res, next);
      expect(sendError).toHaveBeenCalledWith(
        res,
        'Name, email, and password are required',
        400,
      );
    });

    it('should hash the password and create a user', async () => {
      req.body = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = { _id: 'userId123', ...req.body };

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

    it('should handle duplicate email error', async () => {
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

  describe('getUser', () => {
    it('should return a user by ID', async () => {
      req.params.id = 'userId123';
      const mockUser = {
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

    it('should return an error if user is not found', async () => {
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

  describe('updateUser', () => {
    it('should hash the password if provided', async () => {
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

    it('should return an error if user is not found', async () => {
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

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
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

    it('should return an error if user is not found', async () => {
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

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { name: 'John Doe' },
        { name: 'Jane Doe' },
      ];
      (User.find as jest.Mock).mockResolvedValue(mockUsers);

      await getAllUsers(req, res, next);

      expect(User.find).toHaveBeenCalled();
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        mockUsers,
      );
    });
  });
});
