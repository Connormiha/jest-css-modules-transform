const fs = require('fs');
const path = require('path');

describe('config sassrc', () => {
  const sassrcPath = path.resolve(__dirname, '..', '.sassrc.js');

  beforeAll(() => {
    fs.writeFileSync(
      sassrcPath,
      fs.readFileSync(path.resolve(__dirname, './sassrc.mock.js'), {
        encoding: 'utf-8',
      }),
    );
  });

  afterAll(() => {
    fs.unlinkSync(sassrcPath);
  });

  it('should import .sass with .sassrc', () => {
    const sassFile = require('./source/style-with-sassrc.sass');
    expect(sassFile).toEqual({ class: 'class', bar: 'bar' });
  });
});
