module.exports = {
  extends: ['plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    'no-shadow': 'off',
    'no-plusplus': 'off',
    'spaced-comment': 'off',
    'guard-for-in': 'off',
    'operator-assignment': 'off',
    'prefer-destructuring': 'off',
    'consistent-return': 'off',
    'no-restricted-syntax': 'off',
    'no-continue': 'off',
    'no-bitwise': 'off',
    'no-redeclare': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.+(test|spec).+(j|t)s?(x)',
          'test?(s)/**/*.+(j|t)s?(x)',
          'cypress/**/*.+(j|t)s',
          '**/*.config.?(m)js',
          '**/test-utils.ts?(x)',
        ],
      },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['sibling', 'parent'], 'index', 'type'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
        pathGroups: [
          {
            pattern: 'react*(-*)',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
        allowSeparatedGroups: true,
      },
    ],
    'import/no-named-as-default': 'off',
    'prefer-object-spread': 'off',
    'arrow-body-style': 'off',
    curly: ['error', 'all'],
  },
}
