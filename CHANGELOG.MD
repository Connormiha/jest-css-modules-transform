## 4.4.2
Add support for camelCase var name for post css `:export`

## 4.4.1
Fix Jest 28 with injectIntoDOM

## 4.4.0
Add Jest 28 support

## 4.3.0
Add Jest 27 support

## 4.2.1
Fixed edge cases with `injectIntoDOM` and scpecial characters.

## 4.2.0
Added `injectIntoDOM` option to inject css into DOM/JSDOM. This can be useful if you check the `getComputedStyle` in tests.

## 4.1.0
For `sass/scss` files try to use `sass` module. If not found, then `node-sass`  
Add optional `sassModuleName` to config.

## 4.0.2
Update postcss versions dependencies

## 4.0.1
Fix parse pseudo-classes `:not`, `:is`, `:matches`

## 4.0.0
Node 8 is no longer supported  
Add `prepend` property for config.  
Now posible define files for prepend(before main content) to each imported css module.
Useful in a situation where the module uses variables or mixins without explicit import.
##### Example (cancat SASS vars for each module before transfromation)
```js
// file jest-css-modules-transform-config.js
module.exports = {
   prepend: [
       'some/url/vars.scss',
       'some/url/theme.scss',
   ],
};
```

## 3.1.0
Add support for async plugins for `Less` and `PostCSS`

## 3.0.1
Fix skip parsing with selectors like `.class1.class2.class3`

## 3.0.0
Fix parsing inside `@media` and with unusual names like `name@suffix`

## 2.5.0
Add `:export` support

## 2.4.0
Add support for custom path for plugin's config path

## 2.3.0
Add property `exportLocalsStyle` (equivalent from [css-loader]((https://github.com/webpack-contrib/css-loader#exportlocalsstyle)))

## 2.2.0
Add compibility for some kind of imports

## 2.1.1
Add postcss config support

## 2.1.0
Allow sassrc.js

## 2.0.3
Use dict keys order like Webpack

## 2.0.2
Use postcss v7

## 2.0.1
Add support `.pcss`, `.postcss` extentions

## 2.0.0
Support nested selectors in pure css via `postcss-nested`.  
Now invalid pure css throw parse error by `postcss`

## 1.1.0
Add optional config file `jest-css-modules-transform-config.js`

## 1.0.5
Fix parsing css with unclosed single/double quotes  
Fix parsing css with pseudo elements and pseudo classes

## 1.0.4
Fix parsing css with comments

## 1.0.3
Fix "import" directive for less, sass, scss, stylus modules

## 1.0.2
Fix detect Windows filename path

## 1.0.0
Stable release
