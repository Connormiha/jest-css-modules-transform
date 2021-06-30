module.exports = {
  testRegex: '/__tests__/with-camel-case-only\\.spec\\.js$',
  transform: {
    '.+\\.css$': '<rootDir>/dist/index.js',
  },
  bail: true,
  collectCoverageFrom: ['src/index.js'],
  testEnvironment: 'jsdom',
};
