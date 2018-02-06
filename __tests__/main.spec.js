const cssFile = require('./source/style.css').default;
const stylusFile = require('./source/style.styl').default;
const sassFile = require('./source/style.sass').default;
const scssFile = require('./source/style.scss').default;
const lessFile = require('./source/style.less').default;
const cssFileBrokenSingleQuote = require('./source/style-broken-single-quote.css').default;
const cssFileBrokenDoubleQuote = require('./source/style-broken-double-quote.css').default;
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

    it('should corrent parse css broken with unclosed single quote till error line', () => {
        expect(cssFileBrokenSingleQuote).toEqual({class1: 'class1'});
    });

    it('should corrent parse broken css broken with unclosed double quote till error line', () => {
        expect(cssFileBrokenDoubleQuote).toEqual({class1: 'class1'});
    });
});
