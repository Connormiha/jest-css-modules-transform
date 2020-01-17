// Only types
import NodeSass from 'node-sass';
import {
    ICSSLoaderConfig,
} from './parser';
import {
    IPrependDataConfig,
} from './utils-parser';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IPostcssOptions = Record<string, any>;

export interface IPreProcessorsConfig {
    cssLoaderConfig: ICSSLoaderConfig;
    sassConfig: Partial<NodeSass.Options>;
    lessConfig: Partial<Less.Options>;
    stylusConfig: Record<string, string | boolean | number>;
    postcssConfig?: IPostcssOptions;
    prepend?: IPrependDataConfig;
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

export const requirePostcssConfig = (postcssConfigPath: string): IPostcssOptions | null => {
    try {
        return require(postcssConfigPath) as IPostcssOptions || null;
    } catch (e) {
        return null;
    }
};

export async function readStream(stream: NodeJS.ReadStream, render: (content: string) => void): Promise<void> {
    let buffer = Buffer.alloc(0);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    render(`${buffer.toString('utf8')}\n\r`);
}
