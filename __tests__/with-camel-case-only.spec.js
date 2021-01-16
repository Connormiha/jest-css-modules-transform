const fs = require('fs');
const path = require('path');

describe('jest-css-modules', () => {
  const configPath = path.resolve(__dirname, '..', 'other-config.js');

  describe('with camelCaseOnly', () => {
    beforeAll(() => {
      fs.writeFileSync(
        configPath,
        "module.exports = {cssLoaderConfig: {exportLocalsStyle: 'camelCaseOnly'}}",
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
