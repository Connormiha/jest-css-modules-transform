const fs = require('fs');
const path = require('path');

describe('jest-css-modules', () => {
  const configPath = path.resolve(__dirname, '..', 'jest-css-modules-transform-config.js');

  describe('inject styles', () => {
    beforeAll(() => {
      const data = {
        injectIntoDOM: true,
      };

      fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(data)}`);
    });

    afterEach(() => {
      // eslint-disable-next-line no-undef
      [...document.head.querySelectorAll('style')].forEach((item) => {
        item.parentNode.removeChild(item);
      });
    })

    afterAll(() => {
      fs.unlinkSync(configPath);
    });

    it('should have correct object params scss', () => {
      const cssFile = require('./source/style.scss');
      expect(typeof cssFile).toBe('object');
      expect(cssFile).toBeInstanceOf(Object);
      expect(Object.keys(cssFile)).toMatchSnapshot();

      // eslint-disable-next-line no-undef
      expect(document.head.querySelector('style')).toMatchSnapshot();
    });

    it('should have correct object params css', () => {
      const cssFile = require('./source/style.css');
      expect(typeof cssFile).toBe('object');
      expect(cssFile).toBeInstanceOf(Object);
      expect(Object.keys(cssFile)).toMatchSnapshot();

      // eslint-disable-next-line no-undef
      expect(document.head.querySelector('style')).toMatchSnapshot();
    });
  });
});
