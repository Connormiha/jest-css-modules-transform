const tsc = require('typescript');
const tsconfig = require('../tsconfig.json');

module.exports = {
  process(src, path) {
    return tsc.transpile(src, tsconfig.compilerOptions, path, []);
  },
};
