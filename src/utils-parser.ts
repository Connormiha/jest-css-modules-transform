import path from 'path';
import fs from 'fs';

export type IPrependDataFunction = (path: string) => string | string[];
export type IPrependDataConfig = string | IPrependDataFunction | Array<IPrependDataFunction | string>;

export const extractUrls = (prependConfig: IPrependDataConfig, filepath: string): string[] => {
    const urls: string[] = [];
    if (typeof prependConfig === 'string') {
        urls.push(prependConfig);
    } else if (Array.isArray(prependConfig)) {
        for (const prepentItem of prependConfig) {
            if (typeof prepentItem === 'string') {
                urls.push(prepentItem);
            } else {
                const dynamicUrls = prepentItem(filepath);
                if (Array.isArray(dynamicUrls)) {
                    urls.push(...dynamicUrls);
                } else {
                    urls.push(dynamicUrls);
                }
            }
        }
    } else if (typeof prependConfig === 'function') {
        const dynamicUrls = prependConfig(filepath);
        if (Array.isArray(dynamicUrls)) {
            urls.push(...dynamicUrls);
        } else {
            urls.push(dynamicUrls);
        }
    }

    return urls.filter(Boolean);
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
