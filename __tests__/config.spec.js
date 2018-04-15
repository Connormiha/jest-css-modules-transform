const cssFileExpect = require('./source/expected');
const fs = require('fs');
const path = require('path');

describe('config', () => {
    const configPath = path.resolve(__dirname, '..', 'jest-css-modules-transform-config.js');
    beforeAll(() => {
        fs.writeFileSync(
            configPath,
            fs.readFileSync(path.resolve(__dirname, './config.mock.js'), {encoding: 'utf-8'})
        );
    });

    afterAll(() => {
        fs.unlinkSync(configPath);
    });

    it('should import .sass', () => {
        const sassFile = require('./source/style-with-config.sass').default;
        expect(sassFile).toEqual(cssFileExpect);
    });

    it('should import .scss', () => {
        const scssFile = require('./source/style-with-config.scss').default;
        expect(scssFile).toEqual(cssFileExpect);
    });

    it('should import .less', () => {
        const lessFile = require('./source/style-with-config.less').default;
        expect(lessFile).toEqual(cssFileExpect);
    });

    it('should import .styl', () => {
        const stulysFile = require('./source/style-with-config.styl').default;
        expect(stulysFile).toEqual(cssFileExpect);
    });
});
