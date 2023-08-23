import { FlatCompat } from '@eslint/eslintrc'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = await Promise.resolve(fileURLToPath(import.meta.url))
const __dirname = await Promise.resolve(path.dirname(__filename))

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const __eslintCofig = [
  ...compat.config({
    parser: '@typescript-eslint/parser',
    extends: [
      'prettier',
      'plugin:prettier/recommended',
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
      '@typescript-eslint/no-var-requires': 'off',
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
      '@next/next/no-html-link-for-pages': 'off',
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/classnames-order': 'error',
      'tailwindcss/enforces-shorthand': 'error',
      'tailwindcss/no-contradicting-classname': 'error',
    },
    settings: {
      next: {
        rootDir: 'apps/web/',
      },
      tailwindcss: {
        callees: ['ClassNameMerger', 'cva'],
        config: 'apps/web/tailwind.config.cjs',
      },
    },
    overrides: [
      {
        files: ['*.ts', '*.tsx'],
        parser: '@typescript-eslint/parser',
      },
    ],
  }),
]

export default __eslintCofig
