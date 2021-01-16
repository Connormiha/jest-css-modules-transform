module.exports = {
  testRegex: '/__tests__/config-sass\\.spec\\.js$',
  transform: {
    '.+\\.(sass|scss)$': '<rootDir>/dist/index.js',
  },
  bail: true,
  collectCoverageFrom: ['src/**/*.js'],
};
