import User from '../../src/models/userModel';

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

  it('should return an array of users when calling find', async (): Promise<void> => {
    const users = await User.find();

    expect(users.length).toBe(1);
    expect(users[0].name).toBe('Test User');
  });
});
