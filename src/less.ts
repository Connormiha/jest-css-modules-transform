import less from 'less';
import {
    readFileSync,
} from 'fs';
import {
    getPreProcessorsConfig,
} from './utils';
const [,, filePath, configPath] = process.argv;

less.render(
    readFileSync(filePath, {encoding: 'utf-8'}),
    Object.assign(
        getPreProcessorsConfig(configPath).lessConfig || {},
        {filename: filePath}
    ) as Less.Options,
).then(
    ({css}) => {
        // eslint-disable-next-line no-console
        console.log(css);
    },
    (error) => {
        // eslint-disable-next-line no-console
        console.error(error);
    }
);
