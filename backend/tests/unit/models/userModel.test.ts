import User from '../../../src/models/userModel';
import '../../mongodb_helper';

describe('User Model', () => {
  beforeEach(async () => {
    await User.deleteMany();
  });

  it('should create and save a user successfully', async (): Promise<void> => {
    const user = new User({
      name: 'Test User',
      email: 'testuser@doesnotexist.com',
      password: 'password123',
    });

    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe('Test User');
    expect(savedUser.email).toBe(
      'testuser@doesnotexist.com',
    );
  });

  it('should not save a user without a name', async () => {
    const user = new User({
      email: 'testuser@doesnotexist.com',
      password: 'password123',
    });

    await expect(user.save()).rejects.toThrow(
      /Name is required/,
    );
  });

  it('should not save a user without an email', async () => {
    const user = new User({
      name: 'Test User',
      password: 'password123',
    });

    await expect(user.save()).rejects.toThrow(
      /Email is required/,
    );
  });

  it('should not save a user without a password', async () => {
    const user = new User({
      name: 'Test User',
      email: 'testuser@doesnotexist.com',
    });

    await expect(user.save()).rejects.toThrow(
      /Password is required/,
    );
  });

  it('should not save a user with an invalid email', async () => {
    const user = new User({
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123',
    });

    await expect(user.save()).rejects.toThrow(
      /invalid-email is not a valid email/,
    );
  });

  it('should not save a user with a password less than 6 characters', async () => {
    const user = new User({
      name: 'Test User',
      email: 'testuser@doesnotexist.com',
      password: '12345',
    });

    await expect(user.save()).rejects.toThrow(
      /Password must be at least 6 characters long/,
    );
  });

  it('should convert email to lowercase before saving', async () => {
    const user = new User({
      name: 'Test User',
      email: 'TestUser@DoesNotExist.COM',
      password: 'password123',
    });

    const savedUser = await user.save();

    expect(savedUser.email).toBe(
      'testuser@doesnotexist.com',
    );
  });

  it('should not allow two users with the same email', async () => {
    const user1 = new User({
      name: 'Test User1',
      email: 'testuser@doesnotexist.com',
      password: 'password123',
    });

    const user2 = new User({
      name: 'Test User2',
      email: 'testuser@doesnotexist.com', // Same email
      password: 'password123',
    });

    await user1.save();

    await expect(user2.save()).rejects.toThrow(
      /duplicate key error/,
    );
  });

  it('should trim whitespace from name before saving', async () => {
    const user = new User({
      name: '   Test User   ',
      email: 'testuser@doesnotexist.com',
      password: 'password123',
    });

    const savedUser = await user.save();

    expect(savedUser.name).toBe('Test User');
  });

  it('should trim whitespace from email before saving', async () => {
    const user = new User({
      name: 'Test User',
      email: '   testuser@doesnotexist.com   ',
      password: 'password123',
    });

    const savedUser = await user.save();

    expect(savedUser.email).toBe(
      'testuser@doesnotexist.com',
    );
  });

  it('should find a user by email', async () => {
    const user = new User({
      name: 'Test User',
      email: 'testuser@doesnotexist.com',
      password: 'password123',
    });

    await user.save();

    const foundUser = await User.findOne({
      email: 'testuser@doesnotexist.com',
    });
    expect(foundUser).toBeDefined();
    expect(foundUser?.name).toBe('Test User');
  });

  it('should delete a user by ID', async () => {
    const user = new User({
      name: 'Test User',
      email: 'testuser@doesnotexist.com',
      password: 'password123',
    });

    const savedUser = await user.save();

    const result = await User.deleteOne({
      _id: savedUser._id,
    });
    expect(result.deletedCount).toBe(1);
  });

  it('should update a user successfully', async () => {
    const user = new User({
      name: 'Test User',
      email: 'testuser@doesnotexist.com',
      password: 'password123',
    });

    const savedUser = await user.save();

    await User.updateOne(
      { _id: savedUser._id },
      { name: 'Updated User' },
    );

    const updatedUser = await User.findById(savedUser._id);
    expect(updatedUser?.name).toBe('Updated User');
  });
});
