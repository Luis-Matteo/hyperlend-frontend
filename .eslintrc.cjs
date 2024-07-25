module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb/hooks',
    'plugin:jsx-a11y/recommended',
  ],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
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
    'react/react-in-jsx-scope': 'off',
    'semi': ['error', 'always'],
    'react/require-default-props': 'off', // If you don't want to enforce defaultProps
    'react/function-component-definition': [2, {
      namedComponents: 'function-declaration',
      unnamedComponents: 'function-expression',
    }],
    'react/button-has-type': 'error',
    'import/prefer-default-export': 'off', // Turn off if you don't want to enforce default export
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'import/extensions': 'off',
      },
    },
  ],
};
