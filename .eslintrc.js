module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-typescript', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    project: './tsconfig.json',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'import/named': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        'newlines-between': 'never',
      },
    ],
    'import/prefer-default-export': 'off',
    'no-console': 'off',
    'react/jsx-curly-newline': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-wrap-multilines': 'off',
    '@typescript-eslint/ban-ts-ignore': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/quotes': 'off',
  },
  overrides: [
    {
      files: ['**/*.tsx'],
      rules: {
        'react/prop-types': 'off',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
