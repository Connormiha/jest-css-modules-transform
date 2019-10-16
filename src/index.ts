import {sep as pathSep, resolve} from 'path';
import {
    execSync,
    ExecSyncOptionsWithStringEncoding,
} from 'child_process';
import postcss from 'postcss';
import Parser from './parser';
import postcssNestedModule from 'postcss-nested';
// Only types
import Stylus from 'stylus';
import NodeSass from 'node-sass';
// eslint-disable-next-line no-unused-vars
import {Transformer} from '@jest/transform';
import {
    getPreProcessorsConfig,
    IPreProcessorsConfig,
    IPostcssOptions,
} from './utils';

const CONFIG_PATH = process.env.JEST_CSS_MODULES_TRANSFORM_CONFIG || 'jest-css-modules-transform-config.js';
const postcssNested = postcss([postcssNestedModule]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let postcssConfig: any;
let postcssPluginWithConfig = null;

let stylus: typeof Stylus;
let sass: typeof NodeSass;

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

let preProcessorsConfig: IPreProcessorsConfig;

let globalSassData: string;

const getGlobalSassData = (rootDir: string): string => {
    try {
        return `${require(resolve(rootDir, '.sassrc.js')).data}\n` || '';
    } catch (e) {
        return '';
    }
};

const requirePostcssConfig = (rootDir: string): IPostcssOptions | null => {
    try {
        return require(resolve(rootDir, 'postcss.config.js')) as IPostcssOptions || null;
    } catch (e) {
        return null;
    }
};

const getFileExtension = (path: string): string => {
    const filename = path.slice(path.lastIndexOf(pathSep) + 1);
    return filename.slice(filename.lastIndexOf('.') + 1);
};

const getSassContent = (src: string, path: string, extention: string, rootDir: string): string => {
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

let parser: Parser;
let configPath = '';
const lessPath = resolve(__dirname, 'less.js');
const nodeExecOptions: ExecSyncOptionsWithStringEncoding = {
    encoding: 'utf-8',
    maxBuffer: 1024 * 1024 * 1024,
};

const moduleTransform: Omit<Transformer, 'getCacheKey'> = {
    process(src, path, config) {
        configPath = configPath || resolve(config.rootDir, CONFIG_PATH);
        preProcessorsConfig = preProcessorsConfig || getPreProcessorsConfig(configPath);
        parser = parser || new Parser(preProcessorsConfig.cssLoaderConfig);
        const extention = getFileExtension(path);
        let textCSS: string | postcss.LazyResult = '';
        let stylusConfig: Record<string, string | boolean | number>;

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
                textCSS = execSync(`node ${lessPath} ${path} ${configPath}`, nodeExecOptions);
                break;

            case 'css':
            case 'pcss':
            case 'postcss':
                postcssConfig = postcssConfig || preProcessorsConfig.postcssConfig || requirePostcssConfig(config.rootDir);
                if (postcssConfig) {
                    postcssPluginWithConfig = postcssPluginWithConfig || postcss(postcssConfig);
                }

                textCSS = postcssConfig ? postcssPluginWithConfig.process(src) : postcssNested.process(src);
                break;
        }

        return moduleTemplate.replace('%s', JSON.stringify(parser.getCSSSelectors(textCSS)));
    },
};

module.exports = moduleTransform;