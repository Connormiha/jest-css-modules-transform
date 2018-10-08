module.exports = {
    testRegex: '/__tests__/config\\.spec\\.js$',
    transform: {
        '.+\\.(css|styl|less|sass|scss)$': '<rootDir>/src/index.js',
    },
    bail: true,
    collectCoverageFrom: ['src/**/*.js'],
};
