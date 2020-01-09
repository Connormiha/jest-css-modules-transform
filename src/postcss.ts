import postcss from 'postcss';
import {
    readFileSync,
} from 'fs';
import {
    getPreProcessorsConfig,
    requirePostcssConfig,
} from './utils';
const [,, filePath, configPath, postcssConfigPath] = process.argv;

// eslint-disable-next-line no-console, @typescript-eslint/no-empty-function
const originalConsoleLog = console.log;
// eslint-disable-next-line no-console, @typescript-eslint/no-empty-function
console.log = (): void => {};
// eslint-disable-next-line no-console, @typescript-eslint/no-empty-function
console.warn = (): void => {};
// eslint-disable-next-line no-console, @typescript-eslint/no-empty-function
console.info = (): void => {};

const postcssConfig = getPreProcessorsConfig(configPath).postcssConfig || requirePostcssConfig(postcssConfigPath) || {};
postcss(postcssConfig.plugins || [])
    .process(
        readFileSync(filePath, {encoding: 'utf-8'}),
        {from: filePath}
    )
    .then(
        ({css}) => {
            originalConsoleLog.call(console, css);
        },
        (error) => {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    );
