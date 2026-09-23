module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'react-refresh',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    // React 17+ uses the automatic JSX runtime.
    'react/react-in-jsx-scope': 'off',
    // TypeScript types replace React PropTypes in this project.
    'react/prop-types': 'off',
    'react/display-name': 'off',
    // Existing code uses a small number of dynamic API shapes.
    '@typescript-eslint/no-explicit-any': 'off',
    'react/no-unescaped-entities': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
