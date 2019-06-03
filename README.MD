[![Build Status](https://travis-ci.org/Connormiha/jest-css-modules-transform.svg?branch=master)](https://travis-ci.org/Connormiha/jest-css-modules-transform)

# jest-css-modules-transform
# Preprocessor css modules for Jest test framework
This preprocessor converts css files in modules like Webpack.
If we have css files
```css
.class1, .class2, .class3 {
    display: block;
}
```
Webpack will transfrom it to object.
```js
{
    class1: 'class1', //value may be different. It depends of localIndentName property
    class2: 'class2',
    class3: 'class3',
}
```

In testing you need to mock all css modules to aviod exception. But use pure object `{}` for mocking is bad idea, because it makes wrong classNames in components. This preprocessor makes correct modules as if Webpack did.

### Usage
In Jest config add option
```json
"transform": {
  ".+\\.(css|styl|less|sass|scss)$": "<rootDir>/node_modules/jest-css-modules-transform"
},
```

It supports `pure CSS`, `SCSS`, `SASS`, `STYLUS` and `LESS`.  

### Options
You can save preproccessor options in file `jest-css-modules-transform-config.js` in root of your project(Where is the file `package.json`).
You can pass options for your preprocessors.
##### example:  
```js
const path = require('path');  
const additionalResolvePath = path.resolve(__dirname, 'src', 'additional_modules');

module.exports = {
    sassConfig: {
        includePaths: [additionalResolvePath],
        precision: 5,
    },
    lessConfig: {
        paths: [additionalResolvePath],
    },
    stylusConfig: {
        paths: [additionalResolvePath],
    },
    postcssConfig: {
        plugins: [
            require('autoprefixer')({
                browsers: ['Chrome 68', 'Firefox 62', 'Safari 12']
            })
        ]
    },
};
```
For all preprocessor options see offical documentations for Sass, Less, Stylus.

#### cssLoaderConfig
##### exportLocalsStyle
Webpack's cssLoader has option [exportLocalsStyle](https://github.com/webpack-contrib/css-loader#exportlocalsstyle).
```js
// file jest-css-modules-transform-config.js
module.exports = {
   cssLoaderConfig: {
        exportLocalsStyle: 'camelCase'
   }
};
```
then this css code
```css
    .foo__bar{color: red;}
    .foo__bar2{color: red;}
```
converted to
```js
    {
        foo__bar: 'foo__bar',
        fooBar: 'foo__bar',
        foo__bar2: 'foo__bar2',
        fooBar: 'foo__bar2',
    }
```
Availibale values `camelCase`, `camelCaseOnly`, `dashes`, `dashesOnly`, `asIs`(by default)

#### Custom config path
By default option plugin's config file is `jest-css-modules-transform-config.js` from root. For specify custom path just add env `JEST_CSS_MODULES_TRANSFORM_CONFIG`. For example:
```bash
JEST_CSS_MODULES_TRANSFORM_CONFIG=custom-config-path npm test
```
or
```bash
JEST_CSS_MODULES_TRANSFORM_CONFIG=custom-config-path yarn test
```
### Install
```
npm i jest-css-modules-transform
```
