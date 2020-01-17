import less from 'less';
import {
    readFileSync,
} from 'fs';
import {
    getPreProcessorsConfig,
    readStream,
} from './utils';
const [,, filePath, configPath, prependContentFlag] = process.argv;

// eslint-disable-next-line no-console, @typescript-eslint/no-empty-function
const originalConsoleLog = console.log;
// eslint-disable-next-line no-console, @typescript-eslint/no-empty-function
console.log = (): void => {};
// eslint-disable-next-line no-console, @typescript-eslint/no-empty-function
console.warn = (): void => {};
// eslint-disable-next-line no-console, @typescript-eslint/no-empty-function
console.info = (): void => {};


const render = (prependedContent: string): void => {
    less.render(
        `${prependedContent}${readFileSync(filePath, {encoding: 'utf-8'})}`,
        Object.assign(
            getPreProcessorsConfig(configPath).lessConfig || {},
            {filename: filePath}
        ) as Less.Options,
    ).then(
        ({css}) => {
            originalConsoleLog.call(console, css);
        },
        (error) => {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    );
};

if (prependContentFlag === '1') {
    readStream(process.stdin, render);
} else {
    render('');
}
