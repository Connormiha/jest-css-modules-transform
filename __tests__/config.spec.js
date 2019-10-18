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
        const sassFile = require('./source/style-with-config.sass');
        expect(sassFile).toMatchSnapshot();
    });

    it('should import .scss', () => {
        const scssFile = require('./source/style-with-config.scss');
        expect(scssFile).toMatchSnapshot();
    });

    it('should import .less', () => {
        const lessFile = require('./source/style-with-config.less');
        expect(lessFile).toMatchSnapshot();
    });

    it('should import .styl', () => {
        const stulysFile = require('./source/style-with-config.styl');
        expect(stulysFile).toMatchSnapshot();
    });

    it('should import .css', () => {
        const cssFile = require('./source/style-with-config.css');
        expect(cssFile).toMatchSnapshot();
    });
});
