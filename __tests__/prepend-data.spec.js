const fs = require('fs');
const path = require('path');

describe('jest-css-modules', () => {
    const configPath = path.resolve(__dirname, '..', 'jest-css-modules-transform-config.js');
    const prependFilePath = path.resolve(__dirname, '..', 'prepended-file.styl');
    const mainSassFilePath = path.resolve(__dirname, '..', 'main-sass-file.scss');
    const importSassFileBadPath = path.resolve(__dirname, '..', 'import-sass-file-bad.scss');
    const importSassFilePath = path.resolve(__dirname, '..', 'import-sass-file.scss');

    describe('prependData', () => {
        beforeAll(() => {
            fs.writeFileSync(
                prependFilePath,
                `.prepended-class {
                    color: red;
                }`
            );

            fs.writeFileSync(
                mainSassFilePath,
                `
                    @import '${importSassFileBadPath}';
                    .class { color: $specColor; }
                `,
            );

            fs.writeFileSync(
                importSassFilePath,
                '.class2 { color: $specColor; }',
            );

            fs.writeFileSync(
                importSassFilePath,
                '$specColor: red;',
            );

            fs.writeFileSync(
                configPath,
                `module.exports = {
                    prepend: '${prependFilePath}',
                    sassConfig: {
                        importer: [
                            (url) => {
                                if (!url.includes('${importSassFileBadPath}')) {
                                    return null;
                                }
    
                                return {
                                    file: '${importSassFilePath}',
                                };
                            },
                        ],
                    },
                }`
            );
        });

        afterAll(() => {
            fs.unlinkSync(configPath);
            fs.unlinkSync(prependFilePath);
            fs.unlinkSync(mainSassFilePath);
            fs.unlinkSync(importSassFilePath);
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

        it('should have correct object params scss with importer', () => {
            const cssFile = require(mainSassFilePath);
            expect(typeof cssFile).toBe('object');
        });
    });
});
