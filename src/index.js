'use strict';

const {sep: pathSep, resolve} = require('path');
const postcss = require('postcss');
const postcssNested = postcss([require('postcss-nested')]);
const Parser = require('./parser');
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

let parser;

module.exports = {
    process(src, path, config) {
        preProcessorsConfig = preProcessorsConfig || getPreProcessorsConfig(config.rootDir);
        parser = parser || new Parser(preProcessorsConfig.cssLoaderConfig);
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

        return moduleTemplate.replace('%s', JSON.stringify(parser.getCSSSelectors(textCSS, path)));
    },
};
