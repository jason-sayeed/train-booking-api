import bcrypt from 'bcrypt';

export const hashPassword = async (
  password: string,
  saltRounds: number = 10,
): Promise<string> => {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    throw new Error('Failed to hash password');
  }
};
