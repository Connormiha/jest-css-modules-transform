import { extractUrls } from 'utils-parser.ts';

describe('utils-parser', () => {
  describe('extractUrls', () => {
    it('should extract string', () => {
      expect(extractUrls('url', 'path')).toEqual(['url']);
    });

    it('should extract function returned string', () => {
      expect(extractUrls((path: string) => `${path}:foo`, 'path')).toEqual(['path:foo']);
    });

    it('should extract function returned array of string', () => {
      expect(extractUrls((path: string) => [`${path}:foo`, 'path', '/'], 'path')).toEqual([
        'path:foo',
        'path',
        '/',
      ]);
    });

    it('should extract mixed array', () => {
      expect(
        extractUrls(
          [
            'first',
            (path: string): string => `second:${path}`,
            (path: string): string[] => [`${path}:foo`, 'path', '/'],
            'last',
          ],
          'filepath',
        ),
      ).toEqual(['first', 'second:filepath', 'filepath:foo', 'path', '/', 'last']);
    });
  });
});
