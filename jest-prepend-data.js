module.exports = {
    testRegex: '/__tests__/prepend-data\\.spec\\.js$',
    transform: {
        '.+\\.(css|styl|less|sass|scss)$': '<rootDir>/dist/index.js',
    },
    bail: true,
    collectCoverageFrom: ['src/index.js'],
};
