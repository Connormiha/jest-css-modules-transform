const fs = require('fs');
const path = require('path');

describe('jest-css-modules', () => {
    const configPath = path.resolve(__dirname, '..', 'jest-css-modules-transform-config.js');
    const prependFilePath = path.resolve(__dirname, '..', 'prepended-file.styl');

    describe('prependData', () => {
        beforeAll(() => {
            const data = {
                prepend: prependFilePath,
            };

            fs.writeFileSync(
                prependFilePath,
                `.prepended-class {
                    color: red;
                }`
            );

            fs.writeFileSync(
                configPath,
                `module.exports = ${JSON.stringify(data)}`
            );
        });

        afterAll(() => {
            fs.unlinkSync(configPath);
            fs.unlinkSync(prependFilePath);
        });

        it('should have correct object params stylus', () => {
            const cssFile = require('./source/style.styl');
            expect(typeof cssFile).toBe('object');
            expect(cssFile).toBeInstanceOf(Object);
            expect(Object.keys(cssFile)).toMatchSnapshot();
            expect(cssFile['prepended-class']).toBe('prepended-class');
        });

        it('should have correct object params css', () => {
            const cssFile = require('./source/style.css');
            expect(typeof cssFile).toBe('object');
            expect(cssFile).toBeInstanceOf(Object);
            expect(Object.keys(cssFile)).toMatchSnapshot();
            expect(cssFile['prepended-class']).toBe('prepended-class');
        });

        it('should have correct object params less', () => {
            const cssFile = require('./source/style.less');
            expect(typeof cssFile).toBe('object');
            expect(cssFile).toBeInstanceOf(Object);
            expect(Object.keys(cssFile)).toMatchSnapshot();
            expect(cssFile['prepended-class']).toBe('prepended-class');
        });

        it('should have correct object params scss', () => {
            const cssFile = require('./source/style.scss');
            expect(typeof cssFile).toBe('object');
            expect(cssFile).toBeInstanceOf(Object);
            expect(Object.keys(cssFile)).toMatchSnapshot();
            expect(cssFile['prepended-class']).toBe('prepended-class');
        });
    });
});
