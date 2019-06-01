module.exports = {
    testRegex: '/__tests__/with-camel-case\\.spec\\.js$',
    transform: {
        '.+\\.css$': '<rootDir>/src/index.js',
    },
    bail: true,
    collectCoverageFrom: ['src/index.js'],
};
