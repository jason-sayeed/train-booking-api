import { hashPassword } from '../../../src/utils/hashPassword';
import bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('hashPassword', (): void => {
  const mockPassword: string = 'mySecretPassword';
  const mockHashedPassword: string = 'hashedPassword123';

  beforeEach(() => {
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue(
      mockHashedPassword,
    );
  });

  it('should call bcrypt.hash with the correct password and salt rounds', async (): Promise<void> => {
    await hashPassword(mockPassword);

    expect(bcrypt.hash).toHaveBeenCalledWith(
      mockPassword,
      10,
    );
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
  });

  it('should return the hashed password from bcrypt', async (): Promise<void> => {
    const result: string = await hashPassword(mockPassword);

    expect(result).toBe(mockHashedPassword);
  });

  it('should throw an error if bcrypt.hash fails', async (): Promise<void> => {
    const mockError: Error = new Error('Bcrypt error');

    (bcrypt.hash as jest.Mock).mockRejectedValue(mockError);

    await expect(
      hashPassword(mockPassword),
    ).rejects.toThrow('Failed to hash password');
    expect(bcrypt.hash).toHaveBeenCalledWith(
      mockPassword,
      10,
    );
  });
});
