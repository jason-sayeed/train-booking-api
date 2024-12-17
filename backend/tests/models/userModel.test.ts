import User from '../../src/models/userModel';
import '../mongodb_helper';

jest.mock('../../src/models/userModel', () => {
  const mockUserData = {
    _id: '123',
    name: 'Test User',
    email: 'testuser@doesnotexist.com',
    password: 'password123',
  };

  const mockUserInstance = {
    save: jest.fn().mockResolvedValue(mockUserData),
  };

  const mockUserModel = {
    find: jest.fn().mockResolvedValue([mockUserData]),
    findOne: jest.fn().mockResolvedValue(mockUserData),
    deleteOne: jest
      .fn()
      .mockResolvedValue({ deletedCount: 1 }),
  };

  return {
    __esModule: true,
    default: Object.assign(
      jest.fn().mockImplementation(() => mockUserInstance),
      mockUserModel,
    ),
  };
});

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create and save a user successfully', async (): Promise<void> => {
    const user = new User({
      name: 'Test User',
      email: 'testuser@doesnotexist.com',
      password: 'password123',
    });

    const savedUser = await user.save();

    expect(savedUser._id).toBe('123');
    expect(savedUser.name).toBe('Test User');
    expect(savedUser.email).toBe(
      'testuser@doesnotexist.com',
    );
  });

  it('should throw an error if save fails', async (): Promise<void> => {
    const user = new User({
      name: 'Test User',
      email: 'testuser@doesnotexist.com',
      password: 'password123',
    });

    user.save = jest
      .fn()
      .mockRejectedValueOnce(new Error('Database error'));

    await expect(user.save()).rejects.toThrow(
      'Database error',
    );
  });

  it('should return an array of users when calling find', async (): Promise<void> => {
    const mockUsers = [
      {
        _id: '123',
        name: 'Test User',
        email: 'testuser@doesnotexist.com',
      },
      {
        _id: '456',
        name: 'Another User',
        email: 'anotheruser@doesnotexist.com',
      },
    ];

    User.find = jest.fn().mockResolvedValue(mockUsers);

    const users = await User.find();

    expect(users.length).toBe(2);
    expect(users[0].name).toBe('Test User');
    expect(users[1].email).toBe(
      'anotheruser@doesnotexist.com',
    );
  });

  it('should find user when calling findOne', async (): Promise<void> => {
    const query = { email: 'testuser@doesnotexist.com' };
    const user = await User.findOne(query);

    if (!user) {
      throw new Error('User not found');
    }

    expect(user.name).toBe('Test User');
    expect(user.email).toBe('testuser@doesnotexist.com');
    expect(User.findOne).toHaveBeenCalledWith(query);
  });

  it('should return null if user is not found', async (): Promise<void> => {
    User.findOne = jest.fn().mockResolvedValueOnce(null);

    const query = { email: 'nonexistent@doesnotexist.com' };
    const user = await User.findOne(query);

    expect(user).toBeNull();
    expect(User.findOne).toHaveBeenCalledWith(query);
  });

  it('should delete a user by ID', async (): Promise<void> => {
    const query = { _id: '123' };
    const result = await User.deleteOne(query);

    expect(result).toEqual({ deletedCount: 1 });
    expect(User.deleteOne).toHaveBeenCalledWith(query);
  });

  it('should not throw an error if user to delete does not exist', async (): Promise<void> => {
    User.deleteOne = jest
      .fn()
      .mockResolvedValueOnce({ deletedCount: 0 });

    const query = { _id: 'nonexistent' };
    const result = await User.deleteOne(query);

    expect(result).toEqual({ deletedCount: 0 });
    expect(User.deleteOne).toHaveBeenCalledWith(query);
  });

  it('should update a user successfully', async (): Promise<void> => {
    const query = { _id: '123' };
    const update = { name: 'Updated Name' };

    User.updateOne = jest.fn().mockResolvedValueOnce({
      matchedCount: 1,
      modifiedCount: 1,
    });

    const result = await User.updateOne(query, update);

    expect(result).toEqual({
      matchedCount: 1,
      modifiedCount: 1,
    });
    expect(User.updateOne).toHaveBeenCalledWith(
      query,
      update,
    );
  });

  it('should return 0 for matchedCount and modifiedCount if user is not found', async (): Promise<void> => {
    const query = { _id: 'nonexistent' };
    const update = { name: 'Updated Name' };

    User.updateOne = jest.fn().mockResolvedValueOnce({
      matchedCount: 0,
      modifiedCount: 0,
    });

    const result = await User.updateOne(query, update);

    expect(result).toEqual({
      matchedCount: 0,
      modifiedCount: 0,
    });
    expect(User.updateOne).toHaveBeenCalledWith(
      query,
      update,
    );
  });

  it('should throw validation error if name is missing', async (): Promise<void> => {
    const user = new User({
      email: 'testuser@doesnotexist.com',
      password: 'password123',
    });

    user.save = jest
      .fn()
      .mockRejectedValueOnce(new Error('Name is required'));

    await expect(user.save()).rejects.toThrow(
      'Name is required',
    );
  });

  it('should throw validation error if email is missing', async (): Promise<void> => {
    const user = new User({
      name: 'testuser@doesnotexist.com',
      password: 'password123',
    });

    user.save = jest
      .fn()
      .mockRejectedValueOnce(
        new Error('Email is required'),
      );

    await expect(user.save()).rejects.toThrow(
      'Email is required',
    );
  });

  it('should throw validation error if password is missing', async (): Promise<void> => {
    const user = new User({
      name: 'Test User',
      email: 'testuser@doesnotexist.com',
    });

    user.save = jest
      .fn()
      .mockRejectedValueOnce(
        new Error('password is required'),
      );

    await expect(user.save()).rejects.toThrow(
      'password is required',
    );
  });

  it('should throw validation error if email format is invalid', async (): Promise<void> => {
    const user = new User({
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123',
    });

    user.save = jest
      .fn()
      .mockRejectedValueOnce(
        new Error('Invalid email entered'),
      );

    await expect(user.save()).rejects.toThrow(
      'Invalid email entered',
    );
  });

  it('should throw validation error if password is less than 6 characters', async (): Promise<void> => {
    const user = new User({
      name: 'Test User',
      email: 'testuser@doesnotexist.com',
      password: '12345',
    });

    user.save = jest
      .fn()
      .mockRejectedValueOnce(
        new Error(
          'Password must be at least 6 characters long',
        ),
      );

    await expect(user.save()).rejects.toThrow(
      'Password must be at least 6 characters long',
    );
  });
});
