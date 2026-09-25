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
    // 'plugin:react-refresh/recommended', // Removed due to config error
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // The project uses the react-jsx runtime (tsconfig.app.json: "jsx":
    // "react-jsx"), so React never needs to be in scope for JSX. Without
    // this, every file is falsely flagged by react/react-in-jsx-scope.
    'react/react-in-jsx-scope': 'off',
    // Props are validated by TypeScript interfaces, not runtime propTypes.
    'react/prop-types': 'off',
    // Add or override rules as needed
  },
  overrides: [
    {
      // Plain-JS PWA support scripts (owned by Phase 8): the TypeScript
      // plugin rules do not apply to non-compiled scripts, and the service
      // worker script uses worker globals, not browser/node globals.
      files: ['docker-pwa-icons.js', 'public/pwa-config.js'],
      env: {
        browser: true,
        serviceworker: true,
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
      // Matches tsconfig.app.json ("jsx": "react-jsx"): JSX compiles without
      // importing React, so the scope rule must not fire.
      runtime: 'automatic',
    },
  },
};
