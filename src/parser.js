const {camelCase, snakeCase} = require('lodash');
const postcss = require('postcss');
const {extractICSS} = require('icss-utils');
const REG_EXP_NAME_BREAK_CHAR = /[\s,.{/#[:]/;

module.exports = class Parser {
    constructor(cssLoaderConfig) {
        this._cssLoaderConfig = cssLoaderConfig;
    }

    pushToResult(result, className) {
        switch ((this._cssLoaderConfig || {}).exportLocalsStyle) {
            case 'camelCase':
                result[className] = className;
                result[camelCase(className)] = className;
                break;

            case 'camelCaseOnly':
                result[camelCase(className)] = className;
                break;

            case 'dashes':
                result[className] = className;
                result[snakeCase(className).replace(/_/g, '-')] = className;
                break;

            case 'dashesOnly':
                result[snakeCase(className).replace(/_/g, '-')] = className;
                break;

            default:
                result[className] = className;
        }
    }

    getCSSSelectors(css, path) {
        const end = css.length;
        let i = 0;
        let char;
        let bracketsCount = 0;
        const result = {};
        const resultAnimations = {};

        while (i < end) {
            if (i === -1) {
                throw Error(`Parse error ${path}`);
            }

            if (css.indexOf('/*', i) === i) {
                i = css.indexOf('*/', i + 2);

                // Unclosed comment. Break to avoid infinity loop
                if (i === -1) {
                    // Don't parse, but save collected result
                    return result;
                }

                continue;
            }

            char = css[i];

            if (char === '{') {
                bracketsCount++;
                i++;
                continue;
            }

            if (char === '}') {
                bracketsCount--;
                i++;
                continue;
            }

            if (char === '"' || char === '\'') {
                do {
                    i = css.indexOf(char, i + 1);
                    // Syntax error since this line. Don't parse, but save collected result
                    if (i === -1) {
                        return result;
                    }
                } while (css[i - 1] === '\\');
                i++;
                continue;
            }

            if (bracketsCount > 0) {
                i++;
                continue;
            }

            if (char === '.' || char === '#') {
                i++;
                const startWord = i;

                while (!REG_EXP_NAME_BREAK_CHAR.test(css[i])) {
                    i++;
                }
                const word = css.slice(startWord, i);

                this.pushToResult(result, word);
                continue;
            }

            if (css.indexOf(':export', i) === i) {
                i += 7;
                continue;
            }

            if (css.indexOf('@keyframes', i) === i) {
                i += 10;
                while (REG_EXP_NAME_BREAK_CHAR.test(css[i])) {
                    i++;
                }

                const startWord = i;
                while (!REG_EXP_NAME_BREAK_CHAR.test(css[i])) {
                    i++;
                }

                const word = css.slice(startWord, i);
                this.pushToResult(resultAnimations, word);
                continue;
            }

            i++;
        }

        return Object.assign(extractICSS(postcss.parse(css)).icssExports, result, resultAnimations);
    }
};
