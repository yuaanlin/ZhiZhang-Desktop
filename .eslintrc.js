module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.js'),
      },
    },
    'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
  },
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    /** Disable rules */
    'no-unused-vars': 'off',
    'no-invalid-this': 'off',
    'require-jsdoc': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',

    /** Basic */
    'max-len': [
      'warn',
      80,
      {
        ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
        ignoreUrls: true,
      },
    ],
    'quote-props': ['warn', 'consistent-as-needed'],
    'indent': ['warn', 2, { SwitchCase: 1 }],
    'react/jsx-indent': ['warn', 2],
    'react/jsx-indent-props': ['warn', 2],
    'quotes': ['warn', 'single'],
    'semi': ['warn', 'always'],
    '@typescript-eslint/no-unused-vars': 'warn',

    /** Naming Conversation */
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'require',
      },
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['PascalCase'],
        prefix: ['is', 'should', 'has', 'can', 'did', 'will', 'ok'],
      },
    ],

    /** Object */
    'object-curly-newline': ['warn', { multiline: true }],
    'object-curly-spacing': ['warn', 'always'],

    /** JSX */
    'react/jsx-first-prop-new-line': ['warn', 'multiline'],
    'react/jsx-max-props-per-line': ['warn', { maximum: 1, when: 'multiline' }],

    /** Array */
    'array-element-newline': ['warn', 'consistent'],
    'array-bracket-newline': ['warn', { multiline: true }],

    /** Spaces */
    'no-trailing-spaces': 'warn',
    'space-in-parens': ['warn', 'never'],
  },
};
