import style from './source/style-with-not.css';

describe('Style with :not selector', () => {
  it('should import default', () => {
    expect(style).toMatchSnapshot();
  });
});
