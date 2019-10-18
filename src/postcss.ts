import postcss from 'postcss';
import {
    readFileSync,
} from 'fs';
import {
    getPreProcessorsConfig,
    requirePostcssConfig,
} from './utils';
const [,, filePath, configPath, postcssConfigPath] = process.argv;

// eslint-disable-next-line no-console
const originalConsoleLog = console.log;
// eslint-disable-next-line no-console
console.log = (): void => {};
// eslint-disable-next-line no-console
console.warn = (): void => {};
// eslint-disable-next-line no-console
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
