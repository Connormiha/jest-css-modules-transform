module.exports = {
  testRegex: '/__tests__/config-with-inject-styles\\.spec\\.js$',
  transform: {
    '.+\\.scss$': '<rootDir>/dist/index.js',
  },
  bail: true,
  collectCoverageFrom: ['src/index.js'],
};
