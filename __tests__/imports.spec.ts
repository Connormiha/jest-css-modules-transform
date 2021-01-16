import style from './source/style.css';
import * as styleAll from './source/style.css';

describe('Imports', () => {
  it('should import default', () => {
    expect(style).toMatchSnapshot();
  });

  it('should import all', () => {
    expect(styleAll).toMatchSnapshot();
  });
});
