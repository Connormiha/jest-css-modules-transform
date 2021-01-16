const fs = require('fs');
const path = require('path');

describe('jest-css-modules', () => {
  const configPath = path.resolve(__dirname, '..', 'jest-css-modules-transform-config.js');

  describe('with camelCase', () => {
    beforeAll(() => {
      fs.writeFileSync(
        configPath,
        "module.exports = {cssLoaderConfig: {exportLocalsStyle: 'camelCase'}}",
      );
    });

    afterAll(() => {
      fs.unlinkSync(configPath);
    });

    it('should have correct object params', () => {
      const cssFile = require('./source/style-nested.css');
      expect(typeof cssFile).toBe('object');
      expect(cssFile).toBeInstanceOf(Object);
      expect(Object.keys(cssFile)).toMatchSnapshot();
    });
  });
});
