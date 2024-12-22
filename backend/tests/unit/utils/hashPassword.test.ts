import { hashPassword } from '../../src/utils/hashPassword';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('hashPassword', () => {
  const mockPassword = 'mySecretPassword';
  const mockHashedPassword = 'hashedPassword123';

  beforeEach(() => {
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue(
      mockHashedPassword,
    );
  });

  it('should call bcrypt.hash with the correct password and salt rounds', async () => {
    await hashPassword(mockPassword);

    expect(bcrypt.hash).toHaveBeenCalledWith(
      mockPassword,
      10,
    );
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
  });

  it('should return the hashed password from bcrypt', async () => {
    const result = await hashPassword(mockPassword);

    expect(result).toBe(mockHashedPassword);
  });
});
