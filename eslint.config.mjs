import globals from 'globals'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    plugins: {
      '@stylistic/ts': stylistic,
    },
  },

  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 2021,
      sourceType: 'module',
    },

    rules: {
      indent: ['error', 2, {
        SwitchCase: 1,
      }],

      semi: 'off',
      quotes: 'off',
      'object-curly-spacing': 'off',

      '@typescript-eslint/array-type': ['error', {
        default: 'array',
      }],

      '@stylistic/ts/ban-ts-comment': 0,
      '@stylistic/ts/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/ts/quotes': ['error', 'single'],
      '@stylistic/ts/semi': ['error', 'never'],
      '@stylistic/ts/object-curly-spacing': ['error', 'always'],
    },
  },
)
