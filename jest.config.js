module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['<rootDir>/jest_transform.js'],
  },
  roots: ['<rootDir>/src/'],
  testEnvironment: 'node',
  clearMocks: true,
  injectGlobals: false,
  collectCoverage: true,
  coverageProvider: 'v8',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/'],
  coverageReporters: ['text', 'cobertura'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        includeConsoleOutput: true,
      },
    ],
  ],
};
