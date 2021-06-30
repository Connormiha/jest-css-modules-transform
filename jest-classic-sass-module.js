module.exports = {
  testRegex: '/__tests__/classic-sass-module\\.spec\\.js$',
  transform: {
    '.+\\.(css|styl|less|sass|scss)$': '<rootDir>/dist/index.js',
  },
  bail: true,
  collectCoverageFrom: ['src/index.js'],
  testEnvironment: 'jsdom',
};
