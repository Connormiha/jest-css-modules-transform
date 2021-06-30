import { sep as pathSep, resolve } from 'path';
import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';
import postcss from 'postcss';
import type LazyResult from 'postcss/lib/lazy-result';
import Parser from './parser';
import { createFileCache, extractUrls } from './utils-parser';
import postcssNestedModule from 'postcss-nested';
import type Stylus from 'stylus';
import type NodeSass from 'node-sass';
import type { Transformer } from '@jest/transform';
import { getPreProcessorsConfig, IPreProcessorsConfig, requirePostcssConfig } from './utils';

const CONFIG_PATH =
  process.env.JEST_CSS_MODULES_TRANSFORM_CONFIG || 'jest-css-modules-transform-config.js';
const postcssNested = postcss([postcssNestedModule]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let postcssConfig: any;

let stylus: typeof Stylus;
let sass: typeof NodeSass;

const moduleTemplate = `
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
`
  .trim()
  .replace(/^\s{4}/g, '');

const injectCssTemplate = `
    const style = document.createElement('style');
    style.innerHTML = \`%s\`;
    document.head.appendChild(style);
`
  .trim()
  .replace(/^\s{4}/g, '');

let preProcessorsConfig: IPreProcessorsConfig;

let globalSassData: string;

const getGlobalSassData = (rootDir: string): string => {
  try {
    return `${require(resolve(rootDir, '.sassrc.js')).data}\n` || '';
  } catch (e) {
    return '';
  }
};

const getFileExtension = (path: string): string => {
  const filename = path.slice(path.lastIndexOf(pathSep) + 1);
  return filename.slice(filename.lastIndexOf('.') + 1);
};

const reguireSassModule = () => {
  for (const moduleName of [preProcessorsConfig.sassModuleName, 'sass', 'node-sass']) {
    if (!moduleName) {
      continue;
    }

    try {
      const moduleSass = require(moduleName);

      if (moduleSass) {
        return moduleSass;
      }
    } catch (e) {
      // pass
    }
  }

  return null;
};

const getSassContent = (src: string, path: string, extention: string, rootDir: string): string => {
  sass = sass || reguireSassModule();

  if (!sass) {
    throw Error("Can't find sass or node-sass module");
  }

  globalSassData = globalSassData === undefined ? getGlobalSassData(rootDir) : globalSassData;

  const sassConfig: NodeSass.SyncOptions = Object.assign(preProcessorsConfig.sassConfig || {}, {
    data: globalSassData + src,
    file: path,
    indentedSyntax: extention === 'sass',
  });

  return String(sass.renderSync(sassConfig).css);
};

let parser: Parser;
let configPath = '';
let postcssConfigPath = '';
const lessPath = resolve(__dirname, 'less.js');
const postcssPath = resolve(__dirname, 'postcss.js');
const nodeExecOptions: ExecSyncOptionsWithStringEncoding = {
  encoding: 'utf-8',
  maxBuffer: 1024 * 1024 * 1024,
};
let getFileData;

const moduleTransform: Omit<Transformer, 'getCacheKey'> = {
  process(src, path, config) {
    config = (config as any).config || config; // jest@27 nests the config in an options object
    getFileData = getFileData || createFileCache(config.cwd);
    configPath = configPath || resolve(config.rootDir, CONFIG_PATH);
    preProcessorsConfig = preProcessorsConfig || getPreProcessorsConfig(configPath);
    parser = parser || new Parser(preProcessorsConfig.cssLoaderConfig);
    const extention = getFileExtension(path);
    let textCSS: string | LazyResult = '';
    let prependDataContent = '';
    let stylusConfig: Record<string, string | boolean | number>;

    if (preProcessorsConfig.prepend) {
      const urls = extractUrls(preProcessorsConfig.prepend, path);

      prependDataContent = urls.map(getFileData).join('\n\r');
    }

    switch (extention) {
      case 'styl':
        stylus = stylus || require('stylus');
        stylusConfig = Object.assign(preProcessorsConfig.stylusConfig || {}, {
          filename: path,
        });
        stylus.render(
          prependDataContent ? `${prependDataContent}\n\r${src}` : src,
          stylusConfig,
          (err, css) => {
            if (err) {
              throw err;
            }

            textCSS = css;
          },
        );

        break;

      case 'sass':
      case 'scss':
        textCSS = getSassContent(
          prependDataContent ? `${prependDataContent}\n\r${src}` : src,
          path,
          extention,
          config.rootDir,
        );
        break;

      case 'less':
        textCSS = execSync(`node ${lessPath} ${path} ${configPath} ${prependDataContent ? 1 : 0}`, {
          ...nodeExecOptions,
          input: prependDataContent,
        });
        break;

      case 'css':
      case 'pcss':
      case 'postcss':
        postcssConfigPath = '' || resolve(config.rootDir, 'postcss.config.js');
        postcssConfig =
          postcssConfig ||
          preProcessorsConfig.postcssConfig ||
          requirePostcssConfig(postcssConfigPath);

        if (postcssConfig) {
          textCSS = execSync(
            `node ${postcssPath} ${path} ${configPath} ${postcssConfigPath} ${
              prependDataContent ? 1 : 0
            }`,
            {
              ...nodeExecOptions,
              input: prependDataContent,
            },
          );
        } else {
          textCSS = postcssNested.process(
            prependDataContent ? `${prependDataContent}\n\r${src}` : src,
          );
        }

        break;
    }

    const moduleCode = moduleTemplate.replace(
      '%s',
      JSON.stringify(parser.getCSSSelectors(textCSS)),
    );

    if (preProcessorsConfig.injectIntoDOM) {
      const textCssString = typeof textCSS === 'string' ? textCSS : textCSS.toString();
      const textCssEscaped = textCssString
        .replace(/`/g, '\\`')
        .replace(/\\(\d)/g, '\\\\$1')
        .replace(/\$\{/g, '\\${');

      return [injectCssTemplate.replace('%s', textCssEscaped), moduleCode].join('\n');
    }

    return moduleCode;
  },
};

module.exports = moduleTransform;
