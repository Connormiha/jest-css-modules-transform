import postcss from 'postcss';
import { readFileSync } from 'fs';
import { getPreProcessorsConfig, readStream, requirePostcssConfig } from './utils';
const [, , filePath, configPath, postcssConfigPath, prependContentFlag] = process.argv;

// eslint-disable-next-line no-console, @typescript-eslint/no-empty-function
const originalConsoleLog = console.log;
// eslint-disable-next-line no-console, @typescript-eslint/no-empty-function
console.log = (): void => {};
// eslint-disable-next-line no-console, @typescript-eslint/no-empty-function
console.warn = (): void => {};
// eslint-disable-next-line no-console, @typescript-eslint/no-empty-function
console.info = (): void => {};

const postcssConfig =
  getPreProcessorsConfig(configPath).postcssConfig || requirePostcssConfig(postcssConfigPath) || {};

const render = (prependedContent: string): void => {
  postcss(postcssConfig.plugins || [])
    .process(`${prependedContent}${readFileSync(filePath, { encoding: 'utf-8' })}`, {
      from: filePath,
    })
    .then(
      ({ css }) => {
        originalConsoleLog.call(console, css);
      },
      (error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      },
    );
};

if (prependContentFlag === '1') {
  readStream(process.stdin, render);
} else {
  render('');
}
