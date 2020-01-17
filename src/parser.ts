import postcss from 'postcss';
import camelCase from 'camelcase';
const dashesCamelCase = (str: string): string => str.replace(/-+(\w)/g, (match, firstLetter) => firstLetter.toUpperCase());
export interface ICSSLoaderConfig {
    exportLocalsStyle?: 'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly' | 'asIs';
}
export type IPrependDataFunction = (path: string) => string | string[];
export type IPrependDataConfig = string | IPrependDataFunction | Array<IPrependDataFunction | string>;

export const extractUrls = (prependConfig: IPrependDataConfig, path: string): string[] => {
    const urls: string[] = [];
    if (typeof prependConfig === 'string') {
        urls.push(prependConfig);
    } else if (Array.isArray(prependConfig)) {
        for (const prepentItem of prependConfig) {
            if (typeof prepentItem === 'string') {
                urls.push(prepentItem);
            } else {
                const dynamicUrls = prepentItem(path);
                if (Array.isArray(dynamicUrls)) {
                    urls.push(...dynamicUrls);
                } else {
                    urls.push(dynamicUrls);
                }
            }
        }
    }

    return urls;
};

export default class Parser {
    private _cssLoaderConfig: ICSSLoaderConfig;

    constructor(cssLoaderConfig: ICSSLoaderConfig) {
        this._cssLoaderConfig = cssLoaderConfig || {};
    }

    pushToResult(result: Record<string, string>, className: string): void {
        switch (this._cssLoaderConfig.exportLocalsStyle) {
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

    getCSSSelectors(css: string | postcss.LazyResult): Record<string, string> {
        const vars: Record<string, string> = {};
        const result: Record<string, string> = {};
        const resultAnimations: Record<string, string> = {};

        const walk = (node: postcss.ChildNode | postcss.Root | postcss.Declaration): void => {
            if (!node) {
                return;
            }

            if (node.type === 'rule') {
                if (node.selector) {
                    node.selector
                        .split(/[\s,~+>]+/)
                        .forEach((str) => {
                            const strs = str.match(/[.#][^.#]+/g);
                            if (strs) {
                                strs.forEach((name) => {
                                    this.pushToResult(
                                        result,
                                        name
                                            .slice(1)
                                            .replace(/\\/g, '')
                                            .replace(/:.*/g, '')
                                    );
                                });
                            }
                        });
                }
            } else if (node.type === 'atrule') {
                if (node.name === 'keyframes' && node.params) {
                    this.pushToResult(resultAnimations, node.params);
                }
            } else if (node.type === 'decl') {
                if (node.prop && node.parent && (node.parent as postcss.Rule).selector === ':export') {
                    vars[node.prop] = node.value;
                }
            }

            if ('nodes' in node) {
                node.nodes.forEach(walk);
            }
        };

        if (typeof css === 'string') {
            walk(postcss.parse(css));
        } else {
            walk(css.root);
        }

        return Object.assign(vars, result, resultAnimations);
    }
}
