// Only types
import NodeSass from 'node-sass';
import fs from 'fs';
import path from 'path';
import {
    ICSSLoaderConfig,
    IPrependDataConfig,
} from './parser';

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

export const createFileCache = (cwd: string): (filepath: string) => string => {
    const cache = new Map();

    return (filepath: string): string => {
        const normalizedPath = path.isAbsolute(filepath) ? filepath : path.resolve(cwd, filepath);

        if (cache.has(normalizedPath)) {
            return cache.get(normalizedPath);
        }

        const fileData = fs.readFileSync(normalizedPath, {encoding: 'utf-8'});
        cache.set(normalizedPath, fileData);

        return fileData;
    };
};

export async function readStream(stream: NodeJS.ReadStream, render: (content: string) => void): Promise<void> {
    let buffer = Buffer.alloc(0);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    render(`${buffer.toString('utf8')}\n\r`);
}
