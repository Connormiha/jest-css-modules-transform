const fs = require('fs');
const path = require('path');

describe('jest-css-modules', () => {
    const configPath = path.resolve(__dirname, '..', 'jest-css-modules-transform-config.js');

    describe('prependData', () => {
        beforeAll(() => {
            const data = {
                sassModuleName: 'node-sass',
            };

            fs.writeFileSync(
                configPath,
                `module.exports = ${JSON.stringify(data)}`
            );
        });

        afterAll(() => {
            fs.unlinkSync(configPath);
        });

        it('should have correct object params scss', () => {
            const cssFile = require('./source/style.scss');
            expect(typeof cssFile).toBe('object');
            expect(cssFile).toBeInstanceOf(Object);
            expect(Object.keys(cssFile)).toMatchSnapshot();
        });

        it('should have correct object params sass', () => {
            const cssFile = require('./source/style.sass');
            expect(typeof cssFile).toBe('object');
            expect(cssFile).toBeInstanceOf(Object);
            expect(Object.keys(cssFile)).toMatchSnapshot();
        });
    });
});
