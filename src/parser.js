const postcss = require('postcss');
const camelCase = require('camelcase');
const dashesCamelCase = (str) => str.replace(/-+(\w)/g, (match, firstLetter) => firstLetter.toUpperCase());

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
                result[dashesCamelCase(className)] = className;
                break;

            case 'dashesOnly':
                result[dashesCamelCase(className)] = className;
                break;

            default:
                result[className] = className;
        }
    }

    getCSSSelectors(css) {
        const vars = {};
        const result = {};
        const resultAnimations = {};

        const walk = (node) => {
            if (!node) {
                return;
            }

            if (node.type === 'rule') {
                if (node.selector) {
                    node.selector
                        .split(/[\s+,~+>]+/)
                        .forEach((str) => {
                            if (str[0] === '.' || str[0] === '#') {
                                this.pushToResult(
                                    result,
                                    str
                                        .slice(1)
                                        .replace(/\\/g, '')
                                        .replace(/:.*/g, '')
                                );
                            }
                        });
                }
            } else if (node.type === 'atrule') {
                if (node.name === 'keyframes' && node.params) {
                    this.pushToResult(resultAnimations, node.params);
                }
            } else if (node.type === 'decl') {
                if (node.prop && node.parent && node.parent.selector === ':export') {
                    vars[node.prop] = node.value;
                }
            }

            if (node.nodes) {
                node.nodes.forEach(walk);
            }
        };

        walk(postcss.parse(css));

        return Object.assign(vars, result, resultAnimations);
    }
};
