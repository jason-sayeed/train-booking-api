import { Request, Response } from 'express';
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
} from '../../src/controllers/userController';
import User from '../../src/models/userModel';
import { hashPassword } from '../../src/utils/hashPassword';
import {
  sendError,
  sendSuccess,
} from '../../src/utils/responseHelper';

jest.mock('../../src/models/userModel');
jest.mock('../../src/utils/hashPassword');
jest.mock('../../src/utils/responseHelper');

describe('User Controller', () => {
  let req: Pick<Request, 'params' | 'body'>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      params: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('createUser', () => {
    it('should return an error if required fields are missing', async () => {
      req.body = { email: 'test@example.com' };
      await createUser(req as Request, res as Response);
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

      (hashPassword as jest.Mock).mockResolvedValue(
        'hashedPassword',
      );

      const mockUser = {
        _id: 'userId123',
        name: 'John Doe',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      (User.create as jest.Mock).mockResolvedValue(
        mockUser,
      );

      await createUser(req as Request, res as Response);

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

      const duplicateError = { code: 11000 };
      (User.create as jest.Mock).mockRejectedValue(
        duplicateError,
      );

      await createUser(req as Request, res as Response);

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

      await getUser(req as Request, res as Response);

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

      await getUser(req as Request, res as Response);

      expect(sendError).toHaveBeenCalledWith(
        res,
        'User not found',
        400,
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

      await updateUser(req as Request, res as Response);

      expect(hashPassword).toHaveBeenCalledWith(
        'new-password',
      );
      expect(User.findByIdAndUpdate).toHaveBeenCalled();
      expect(sendSuccess).toHaveBeenCalled();
    });

    it('should return an error if user is not found', async () => {
      req.params.id = 'userId123';
      (
        User.findByIdAndUpdate as jest.Mock
      ).mockResolvedValue(null);

      await updateUser(req as Request, res as Response);

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

      await deleteUser(req as Request, res as Response);

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

      await deleteUser(req as Request, res as Response);

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

      await getAllUsers(req as Request, res as Response);

      expect(User.find).toHaveBeenCalled();
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        mockUsers,
      );
    });
  });
});
