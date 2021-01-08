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
  ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform"
},
```
or
```json
"transform": {
  ".+\\.(css|styl|less|sass|scss)$": "<rootDir>/node_modules/jest-css-modules-transform"
},
```

It supports `pure CSS`, `SCSS`, `SASS`, `STYLUS` and `LESS`.  

#### For PostCSS
For `.css`, `.pcss`, `.postcss` files used `postcss.config.js` from root folder(if file exist of course).  
For tests you can rewrite your existed `postcss.config.js`. See options.
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
Available values `camelCase`, `camelCaseOnly`, `dashes`, `dashesOnly`, `asIs`(by default)

#### prepend
Type: `string`, `Function`, `Array<string | Function>`  
Default: `null`

Pass urls for prepend(before file content) to transformed files.  
Useful in a situation where the module uses variables or mixins without explicit import. 

For example you have vars in file, but without implicit import. You can prepend file with `sass` variables before convert module.

#### injectIntoDOM
Type: `boolean`
Default: `false`

Inject the generated CSS into the head of the document.

This option could be useful for visual regression testing, where the output dom has the styles applied to it.

#### sassModuleName
Type: `string`
Default: `null`

The default nodejs module for `sass/scss` files is `sass`. If not found in node_modules, then `node-sass`. You can define any another module.

###### Example with array of paths
```js
// file jest-css-modules-transform-config.js
module.exports = {
   prepend: [
       'some/url/vars.scss',
       'some/url/theme.scss',
   ],
};
```
###### Example with single string
```js
// file jest-css-modules-transform-config.js
module.exports = {
   prepend: 'some/url/vars.scss',
};
```

###### Example with custom function
```js
// file jest-css-modules-transform-config.js
module.exports = {
   prepend: (filepath) => {
       if (filepath.includes('components')) {
           return [
               'components/vars.scss',
               'components2/vars.scss',
           ];
       }

       return [
            'common/vars.scss',
            'common/vars2.scss',
       ];
   },
};
```
It works with any preprocessors(Sass, Less, Styles, PostCSS, pure CSS)

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
