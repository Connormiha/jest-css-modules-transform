module.exports = {
    testRegex: '/__tests__/.*\\.spec\\.(js|ts)$',
    testPathIgnorePatterns: [
        '/node_modules/',
        '/__tests__/config\\.spec\\.js$',
        '/__tests__/config-sass\\.spec\\.js$',
        '/__tests__/with-camel-case\\.spec\\.js$',
        '/__tests__/with-camel-case-only\\.spec\\.js$',
        '/__tests__/with-dashes\\.spec\\.js$',
        '/__tests__/prepend-data\\.spec\\.js$',
        '/__tests__/prepend-data-relative-path\\.spec\\.js$',
    ],
    transform: {
        '.+\\.(css|styl|less|sass|scss)$': '<rootDir>/dist/index.js',
        '.+\\.ts$': '<rootDir>/__tests__/preprocessor-typescript.js',
    },
    bail: true,
    collectCoverageFrom: ['src/**/*.js'],
    moduleDirectories: [
        'node_modules',
        'src',
    ],
};
