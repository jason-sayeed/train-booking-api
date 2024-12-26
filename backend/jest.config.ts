import * as dotenv from 'dotenv';

const envFile: '.env.test' | '.env' =
  process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

dotenv.config({ path: envFile });

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],

  roots: ['<rootDir>/tests'],

  transform: {
    '^.+\\.(ts|js)$': 'ts-jest',
  },

  testRegex: '((\\.|/)(test|spec))\\.tsx?$',

  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
  ],
};
