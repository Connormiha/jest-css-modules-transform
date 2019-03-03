const cssFile = require('./source/style.css').default;
const stylusFile = require('./source/style.styl').default;
const sassFile = require('./source/style.sass').default;
const scssFile = require('./source/style.scss').default;
const lessFile = require('./source/style.less').default;
const cssNestedFile = require('./source/style-nested.css').default;
const cssFileExpect = require('./source/expected');
expect(Object.keys(cssFile).slice(-1)[0]).toBe('sunrise');
describe('jest-css-modules', () => {
    [
        ['css', cssFile],
        ['styl', stylusFile],
        ['sass', sassFile],
        ['scss', scssFile],
        ['less', lessFile],
    ].forEach(([ext, style]) => {
        it(`should import .${ext}`, () => {
            expect({...style}).toEqual(cssFileExpect);
        });

        it(`should import .${ext} and keyframes should be last`, () => {
            const keys = Object.keys(style);

            expect(keys[0]).toBe('class1');
            // keyframes should be last, like Webpack did it
            expect(keys[keys.length - 1]).toBe('sunrise');
        });
    });

    it('should import .css with nested', () => {
        expect({...cssNestedFile}).toEqual({
            foo: 'foo',
            foo__bar: 'foo__bar',
            foo__zoo: 'foo__zoo',
            boo: 'boo',
        });
    });
});
