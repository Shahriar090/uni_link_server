import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import eslintPluginPrettier from 'eslint-plugin-prettier';

// Ensure Prettier is configured after other ESLint plugins
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },

  // Apply the recommended rules from ESLint and TypeScript
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  // Add Prettier plugin configuration
  {
    plugins: { prettier: eslintPluginPrettier },
    rules: {
      'prettier/prettier': 'error', // Enables Prettier rules and treats them as ESLint errors
      eqeqeq: 'off',
      'no-unused-vars': 'error',
      'no-console': 'warn',
      'no-unused-expressions': 'error',
      'no-undef': 'error',
      'prefer-const': ['error', { ignoreReadBeforeAssign: true }],
    },
    globals: {
      process: 'readonly',
    },
  },

  {
    ignores: ['node_modules/*', './dist'],
  },
];
