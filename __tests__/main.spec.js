const cssFile = require('./source/style.css').default;
const stylusFile = require('./source/style.styl').default;
const sassFile = require('./source/style.sass').default;
const scssFile = require('./source/style.scss').default;
const lessFile = require('./source/style.less').default;
const cssNestedFile = require('./source/style-nested.css').default;
const cssFileExpect = require('./source/expected');

describe('jest-css-modules', () => {
    it('should import .css', () => {
        expect(cssFile).toEqual(cssFileExpect);
    });

    it('should import .styl', () => {
        expect(stylusFile).toEqual(cssFileExpect);
    });

    it('should import .sass', () => {
        expect(sassFile).toEqual(cssFileExpect);
    });

    it('should import .scss', () => {
        expect(scssFile).toEqual(cssFileExpect);
    });

    it('should import .less', () => {
        expect(lessFile).toEqual(cssFileExpect);
    });

    it('should import .css with nested', () => {
        expect(cssNestedFile).toEqual({
            foo: 'foo',
            foo__bar: 'foo__bar',
            foo__zoo: 'foo__zoo',
            boo: 'boo',
        });
    });
});
