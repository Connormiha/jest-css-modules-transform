const path = require('path');
const additionalResolvePath = path.resolve(__dirname, '__tests__', 'additional_modules');

module.exports = {
  sassConfig: {
    includePaths: [additionalResolvePath],
    precision: 5,
  },
  lessConfig: { paths: [additionalResolvePath] },
  stylusConfig: { paths: [additionalResolvePath] },
  postcssConfig: {
    plugins: [require('postcss-nested')],
  },
};
