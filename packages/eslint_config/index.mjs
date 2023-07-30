import { FlatCompat } from '@eslint/eslintrc'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = await Promise.resolve(fileURLToPath(import.meta.url))
const __dirname = await Promise.resolve(path.dirname(__filename))
const require = await Promise.resolve((await import('module')).Module.createRequire(import.meta.url))
const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const __eslintCofig = [
  ...compat.config({
    parser: '@typescript-eslint/parser',
    extends: [
      'prettier',
      'plugin:prettier/recommended',
      'plugin:import/recommended',
      'plugin:storybook/recommended',
      'plugin:tailwindcss/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@next/next/recommended',
    ],
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'testing-library/prefer-screen-queries': 'off',
      '@next/next/no-html-link-for-pages': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
      'tailwindcss/classnames-order': 'error',
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/enforces-shorthand': 'error',
      'tailwindcss/no-contradicting-classname': 'error',
      'import/order': [
        1,
        {
          groups: ['external', 'builtin', 'internal', 'sibling', 'parent', 'index'],
          pathGroupsExcludedImportTypes: ['internal'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
    settings: {
      next: {
        rootDir: 'apps/web/',
      },
      'import/parsers': {
        [require.resolve('@typescript-eslint/parser')]: ['.ts', '.tsx', '.d.ts'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  }),
]

export default __eslintCofig
