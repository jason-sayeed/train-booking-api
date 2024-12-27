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

  collectCoverage: true, // Enable coverage collection
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', // Adjust to match your source code files
    '!src/**/*.d.ts', // Optionally exclude declaration files from coverage
  ],
  coverageDirectory: 'coverage', // Specify the directory to output coverage reports
  coverageProvider: 'v8', // Use the V8 coverage provider (can also use 'babel')
  coverageReporters: ['text', 'lcov'], // Output coverage reports in text and lcov formats
};
