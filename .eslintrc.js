module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2022,
    sourceType: 'module',
    createDefaultProgram: true,
    ecmaFeatures: {
      impliedStrict: true,
    },
  },
  plugins: ['@typescript-eslint', 'jest', 'promise', 'sonarjs'],
  settings: {
    'node': {
      resolvePaths: [__dirname],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:eslint-comments/recommended',
    'plugin:import/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:node/recommended',
    'plugin:prettier/recommended',
    'plugin:promise/recommended',
    'plugin:sonarjs/recommended',
  ],
  env: {
    es2022: true,
    node: true,
    jest: false,
    browser: false,
  },
  rules: {
    'jest/prefer-expect-assertions': 'error',
    'object-shorthand': 'error',
    'import/order': [
      'error',
      {
        'pathGroups': [
          {
            pattern: '@jest/globals',
            group: 'builtin',
            position: 'before',
          },
        ],
        'groups': [
          'builtin',
          [
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'unknown',
          ],
          'type',
        ],
        'newlines-between': 'never',
        'warnOnUnassignedImports': true,
        'pathGroupsExcludedImportTypes': ['builtin'],
        'alphabetize': { order: 'asc', caseInsensitive: true },
      },
    ],
    'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
  },
  overrides: [
    {
      files: ['*.ts'],
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
      ],
      rules: {
        'node/no-missing-import': 'off',
        'node/no-unsupported-features/es-syntax': [
          'error',
          {
            ignores: ['modules', 'dynamicImport', 'optionalCatchBinding'],
          },
        ],
        'node/no-unpublished-import': [
          'error',
          {
            allowModules: ['@jest/globals'],
          },
        ],
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            varsIgnorePattern: '_',
            argsIgnorePattern: '_',
          },
        ],
      },
    },
    {
      files: ['*json', '.swcrc', 'tsconfig.json'],
      extends: ['plugin:json/recommended'],
    },
    {
      files: ['jest_transform.js'],
      rules: {
        'node/no-unpublished-require': [
          'error',
          {
            allowModules: ['@swc/jest'],
          },
        ],
      },
    },
  ],
  ignorePatterns: [
    '.git/',
    '.devcontainer/',
    '.vscode/',
    '.pnpm-store/',
    'dist/',
    'coverage/',
    'patches/',
  ],
};
