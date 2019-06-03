'use strict';

const {sep: pathSep, resolve} = require('path');
const postcss = require('postcss');
const postcssNested = postcss([require('postcss-nested')]);
const {camelCase, snakeCase} = require('lodash');
const CONFIG_PATH = process.env.JEST_CSS_MODULES_TRANSFORM_CONFIG || 'jest-css-modules-transform-config.js';
let postcssConfig = null;
let postcssPluginWithConfig = null;

let stylus;
let sass;
let less;

const moduleTemplate = `
    "use strict";

    const data = %s;

    if (typeof module === 'object' && module) {
        Object.defineProperty(data, "__esModule", {
            value: true
        });
        module.exports = new Proxy(data, {
            get(target, attr) {
                if (attr === 'default') {
                    return target;
                };
                return target[attr];
            },

            getPrototypeOf() {
                return Object;
            }
        });
    } else {
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = data;
    }
`;

let preProcessorsConfig;
const getPreProcessorsConfig = (function wrap() {
    const preProcessorsConfigDefalut = {
        sassConfig: {},
        lessConfig: {},
        stylusConfig: {},
        cssLoaderConfig: {},
    };

    return (rootDir) => {
        if (preProcessorsConfig) {
            return preProcessorsConfig;
        }

        try {
            return require(resolve(rootDir, CONFIG_PATH));
        } catch (e) {
            return preProcessorsConfigDefalut;
        }
    };
}());

const REG_EXP_NAME_BREAK_CHAR = /[\s,.{/#[:]/;

const pushToResult = (result, className) => {
    const {cssLoaderConfig} = preProcessorsConfig;

    switch ((cssLoaderConfig || {}).exportLocalsStyle) {
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
};

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

            pushToResult(result, word);
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
            pushToResult(resultAnimations, word);
            continue;
        }

        i++;
    }

    return Object.assign(result, resultAnimations);
};

let globalSassData;

const getGlobalSassData = (rootDir) => {
    try {
        return `${require(resolve(rootDir, '.sassrc.js')).data}\n` || '';
    } catch (e) {
        return '';
    }
};

const requirePostcssConfig = (rootDir) => {
    try {
        return require(resolve(rootDir, 'postcss.config.js'));
    } catch (e) {
        return null;
    }
};

const getFileExtension = (path) => {
    const filename = path.slice(path.lastIndexOf(pathSep) + 1);
    return filename.slice(filename.lastIndexOf('.') + 1);
};

const getSassContent = (src, path, extention, rootDir) => {
    sass = sass || require('node-sass');
    globalSassData = globalSassData === undefined ? getGlobalSassData(rootDir) : globalSassData;
    const sassConfig = Object.assign(
        preProcessorsConfig.sassConfig || {},
        {
            data: globalSassData + src,
            file: path,
            indentedSyntax: extention === 'sass',
        }
    );
    return String(sass.renderSync(sassConfig).css);
};

module.exports = {
    process(src, path, config) {
        preProcessorsConfig = preProcessorsConfig || getPreProcessorsConfig(config.rootDir);
        const extention = getFileExtension(path);
        let textCSS = src;
        let lessConfig;
        let stylusConfig;

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
                textCSS = getSassContent(src, path, extention, config.rootDir);
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
                postcssConfig = postcssConfig || preProcessorsConfig.postcssConfig || requirePostcssConfig(config.rootDir);
                if (postcssConfig) {
                    postcssPluginWithConfig = postcssPluginWithConfig || postcss(postcssConfig);
                }
                textCSS = postcssConfig ? postcssPluginWithConfig.process(src).css : postcssNested.process(src).css;
                break;
        }

        return moduleTemplate.replace('%s', JSON.stringify(getCSSSelectors(textCSS, path)));
    },
};
