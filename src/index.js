'use strict';

const {sep: pathSep, resolve} = require('path');
const postcss = require('postcss');
const postcssNested = postcss([require('postcss-nested')]);

let stylus;
let sass;
let less;

const moduleTemplate = `
    "use strict";

    Object.defineProperty(exports, "__esModule", {
       value: true
    });

    exports.default = %s;
`;

const REG_EXP_NAME_BREAK_CHAR = /[\s,.{/#[:]/;

const getCSSSelectors = (css, path) => {
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

            result[word] = word;
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
            resultAnimations[word] = word;
            continue;
        }

        i++;
    }

    return Object.assign(result, resultAnimations);
};

const getPreProcessorsConfig = (function wrap() {
    const preProcessorsConfigDefalut = {
        sassConfig: {},
        lessConfig: {},
        stylusConfig: {},
    };

    let preProcessorsConfig;

    return (rootDir) => {
        if (preProcessorsConfig) {
            return preProcessorsConfig;
        }

        try {
            preProcessorsConfig = require(resolve(rootDir, 'jest-css-modules-transform-config.js'));
        } catch (e) {
            preProcessorsConfig = preProcessorsConfigDefalut;
        }

        return preProcessorsConfig;
    };
}());

const getGlobalSassData = (rootDir) => {
    try {
        return require(resolve(rootDir, '.sassrc.js')).data || '';
    } catch (e) {
        return '';
    }
};

module.exports = {
    process(src, path, config) {
        const preProcessorsConfig = getPreProcessorsConfig(config.rootDir);
        const filename = path.slice(path.lastIndexOf(pathSep) + 1);
        const extention = filename.slice(filename.lastIndexOf('.') + 1);
        let textCSS = src;
        let sassConfig;
        let lessConfig;
        let stylusConfig;
        let globalSassData;

        switch (extention) {
            case 'styl':
                stylus = stylus || require('stylus');
                stylusConfig = Object.assign(
                    preProcessorsConfig.stylusConfig || {},
                    {filename: path}
                );
                stylus.render(src, stylusConfig, (err, css) => {
                    if (err) {
                        throw err;
                    }

                    textCSS = css;
                });

                break;

            case 'sass':
            case 'scss':
                sass = sass || require('node-sass');
                globalSassData = getGlobalSassData(config.rootDir);
                sassConfig = Object.assign(
                    preProcessorsConfig.sassConfig || {},
                    {
                        data: globalSassData + src,
                        file: path,
                        indentedSyntax: extention === 'sass',
                    }
                );
                textCSS = String(sass.renderSync(sassConfig).css);
                break;

            case 'less':
                less = less || require('less');
                lessConfig = Object.assign(
                    preProcessorsConfig.lessConfig || {},
                    {filename: path}
                );
                less.render(src, lessConfig, (err, css) => {
                    if (err) {
                        throw err;
                    }

                    textCSS = css.css;
                });

                break;
            case 'css':
            case 'pcss':
            case 'postcss':
                textCSS = postcssNested.process(src).css;
                break;
        }

        return moduleTemplate.replace('%s', JSON.stringify(getCSSSelectors(textCSS, path)));
    },
};
