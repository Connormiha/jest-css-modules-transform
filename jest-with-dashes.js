module.exports = {
  testRegex: '/__tests__/with-dashes\\.spec\\.js$',
  transform: {
    '.+\\.css$': '<rootDir>/dist/index.js',
  },
  bail: true,
  collectCoverageFrom: ['src/index.js'],
  testEnvironment: 'jsdom',
};
