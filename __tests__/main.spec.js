const cssFile = require('./source/style.css');
const stylusFile = require('./source/style.styl');
const sassFile = require('./source/style.sass');
const scssFile = require('./source/style.scss');
const lessFile = require('./source/style.less');
const cssNestedFile = require('./source/style-nested.css');

describe('jest-css-modules', () => {
    [
        ['css', cssFile],
        ['styl', stylusFile],
        ['sass', sassFile],
        ['scss', scssFile],
        ['less', lessFile],
    ].forEach(([ext, style]) => {
        it(`should import .${ext}`, () => {
            expect(style).toMatchSnapshot();
        });

        it(`should import .${ext} and keyframes should be last`, () => {
            const keys = Object.keys(style);

            // keyframes should be last, like Webpack did it
            expect(keys[keys.length - 1]).toBe('sunrise');
        });
    });

    it('should import .css with nested', () => {
        expect(cssNestedFile).toEqual({
            foo: 'foo',
            foo__bar: 'foo__bar',
            foo__zoo: 'foo__zoo',
            boo: 'boo',
            foox: 'foox',
            fooy: 'fooy',
            fooz: 'fooz',
            tilda: 'tilda',
            plus: 'plus',
            children: 'children',
            foo2: 'foo2',
            fooy2: 'fooy2',
            fooz2: 'fooz2',
            tilda2: 'tilda2',
            plus2: 'plus2',
            children2: 'children2',
            'display-block': 'display-block',
            'display-block@sm': 'display-block@sm',
            'display-block@sm@sm2': 'display-block@sm@sm2',
        });
    });

    it('should have correct object params', () => {
        expect(typeof cssFile).toBe('object');
        expect(cssFile).toBeInstanceOf(Object);
        expect(Object.keys(cssFile)).toMatchSnapshot();

        // eslint-disable-next-line no-undef
        expect(document.head.querySelector('style')).toBeFalsy();
    });
});
