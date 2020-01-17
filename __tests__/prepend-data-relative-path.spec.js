const fs = require('fs');
const path = require('path');

describe('jest-css-modules', () => {
    const configPath = path.resolve(__dirname, '..', 'jest-css-modules-transform-config.js');
    const cssModuleBasePath = path.resolve(__dirname, 'source/temp-style.');

    describe('prependData relative path', () => {
        beforeAll(() => {
            fs.writeFileSync(
                `${cssModuleBasePath}styl`,
                [
                    '.class{color: green;}',
                    '.class2{color: green;}',
                    '',
                    'for $item in may_var',
                    '  .{$item}',
                    '    color: $color',
                ].join('\n\r'),
            );

            fs.writeFileSync(
                path.resolve(__dirname, 'source', 'temp-prepended-file.styl'),
                [
                    'may_var = foo, bar, dar',
                    '$color = #000',
                    '.prepended-class{color: red;}',
                ].join('\n\r'),
            );

            fs.writeFileSync(
                `${cssModuleBasePath}sass`,
                [
                    '.class',
                    '  color: green;',
                    '.class2',
                    '  color: green;',
                    '',
                    '@each $item in $may_var',
                    '  .#{$item}',
                    '    color: $color',
                ].join('\n\r'),
            );

            fs.writeFileSync(
                path.resolve(__dirname, 'source', 'temp-prepended-file.sass'),
                [
                    '$may_var: foo, bar, dar',
                    '$color: #000',
                    '.prepended-class',
                    '  color: red;',
                ].join('\n\r'),
            );

            fs.writeFileSync(
                configPath,
                `module.exports = {
                    prepend: (filepath) => {
                        const extention = filepath.match(/\\.([a-z]+)$/)[1];
    
                        return '__tests__/source/temp-prepended-file.' + extention;
                    },
                }`
            );
        });

        afterAll(() => {
            fs.unlinkSync(configPath);
            fs.unlinkSync(`${cssModuleBasePath}styl`);
            fs.unlinkSync(path.resolve(__dirname, 'source', 'temp-prepended-file.styl'));
            fs.unlinkSync(`${cssModuleBasePath}sass`);
            fs.unlinkSync(path.resolve(__dirname, 'source', 'temp-prepended-file.sass'));
        });

        it('should have correct object params stylus', () => {
            const cssFile = require('./source/temp-style.styl');
            expect(typeof cssFile).toBe('object');
            expect(cssFile).toBeInstanceOf(Object);
            expect(Object.keys(cssFile)).toMatchSnapshot();
        });

        it('should have correct object params sass', () => {
            const cssFile = require('./source/temp-style.sass');
            expect(typeof cssFile).toBe('object');
            expect(cssFile).toBeInstanceOf(Object);
            expect(Object.keys(cssFile)).toMatchSnapshot();
        });
    });
});
