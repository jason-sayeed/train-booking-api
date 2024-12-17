module.exports = {
  // Use ts-jest preset for testing TypeScript files with Jest
  preset: 'ts-jest',
  // Set the test environment to Node.js
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],

  // Define the root directory for tests and modules
  roots: ['<rootDir>/tests'],

  // Use ts-jest to transform TypeScript files
  transform: {
    '^.+\\.(ts|js)$': 'ts-jest',
  },

  // Regular expression to find test files
  testRegex: '((\\.|/)(test|spec))\\.tsx?$',

  // File extensions to recognise in module resolution
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
  ],
};
