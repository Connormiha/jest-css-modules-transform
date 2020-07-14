module.exports = {
    extends: [
      'eslint:all',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended'
    ],
    parser: '@typescript-eslint/parser',
    plugins: [
      'jest',
      '@typescript-eslint'
    ],
    overrides: [
      {
        files: [
          '__tests__/**/*.spec.js'
        ],
        env: {
          jest: true
        }
      },
      {
        files: [
          'src/**/*.ts'
        ]
      }
    ],
    env: {
      es6: true,
      node: true
    },
    parserOptions: {
      sourceType: 'module'
    },
    rules: {
      '@typescript-eslint/naming-convention': ['error', {
        selector: 'interface',
        format: ["PascalCase"],
        custom: { regex: "^I[A-Z]", match: true }
      }],
      '@typescript-eslint/no-var-requires': 'off',
      quotes: [
        'error',
        'single'
      ],
      'space-before-function-paren': [
        'error',
        'never'
      ],
      'padded-blocks': [
        'error',
        'never'
      ],
      'quote-props': [
        'error',
        'as-needed'
      ],
      complexity: 'off',
      'sort-imports': 'off',
      'id-length': 'off',
      'sort-keys': 'off',
      camelcase: 'off',
      'no-magic-numbers': 'off',
      'function-paren-newline': 'off',
      'function-call-argument-newline': 'off',
      'no-extra-parens': 'off',
      'default-case': 'off',
      'no-plusplus': 'off',
      strict: 'off',
      'capitalized-comments': 'off',
      'object-property-newline': 'off',
      'dot-location': 'off',
      'multiline-ternary': 'off',
      'max-statements': 'off',
      'no-ternary': 'off',
      'init-declarations': 'off',
      'array-element-newline': 'off',
      'valid-jsdoc': 'off',
      'no-sync': 'off',
      'linebreak-style': 'off',
      'func-style': 'off',
      'no-process-env': 'off',
      'no-param-reassign': 'off',
      'max-lines-per-function': 'off',
      'global-require': 'off',
      'require-jsdoc': 'off',
      'prefer-named-capture-group': 'off',
      'no-prototype-builtins': 'off',
      'no-continue': 'off',
      'no-undefined': 'off',
      'no-underscore-dangle': 'off',
      'require-unicode-regexp': 'off',
      'max-params': [
        'error',
        5
      ],
      'one-var': [
        'error',
        'never'
      ],
      indent: [
        'error',
        4,
        {
          SwitchCase: 1
        }
      ],
      'comma-dangle': [
        'error',
        'always-multiline'
      ],
      'max-len': [
        'error',
        140
      ]
    }
  };
