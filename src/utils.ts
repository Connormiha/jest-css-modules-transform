// Only types
import NodeSass from 'node-sass';
import {ICSSLoaderConfig} from './parser';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IPostcssOptions = Record<string, any>;

export interface IPreProcessorsConfig {
    cssLoaderConfig: ICSSLoaderConfig;
    sassConfig: Partial<NodeSass.Options>;
    lessConfig: Partial<Less.Options>;
    stylusConfig: Record<string, string | boolean | number>;
    postcssConfig?: IPostcssOptions;
}

export const getPreProcessorsConfig = (function wrap(): (rootDit: string) => IPreProcessorsConfig {
    const preProcessorsConfigDefalut = {
        sassConfig: {},
        lessConfig: {},
        stylusConfig: {},
        cssLoaderConfig: {},
    };

    return (configPath: string): IPreProcessorsConfig => {
        try {
            return require(configPath) as IPreProcessorsConfig || preProcessorsConfigDefalut;
        } catch (e) {
            return preProcessorsConfigDefalut;
        }
    };
}());
