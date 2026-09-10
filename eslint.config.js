const { FlatCompat } = require('@eslint/eslintrc')
const babelParser = require('@babel/eslint-parser')

const compat = new FlatCompat({
  baseDirectory: __dirname
})

module.exports = [
  ...compat.extends('airbnb-base/legacy', 'plugin:prettier/recommended'),
  {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        requireConfigFile: false
      }
    },
    ignores: [
      '**/node_modules/**',
      '**/vendor/**',
      '**/wp-content/**',
      '**/.next/**',
      '**/.out/**',
      '**/build/**',
      '**/dist/**',
      '**/_templates/**',
      '**/tests/**',
      '**/coverage/**',
      '**/test-results/**',
      '**/storybook-static/**'
    ],
    rules: {
      'newline-per-chained-call': ['error', { ignoreChainWithDepth: 4 }],
      'lines-around-comment': [
        'error',
        {
          beforeBlockComment: true,
          afterBlockComment: true,
          beforeLineComment: true,
          afterLineComment: false,
          allowBlockStart: true,
          allowBlockEnd: true,
          allowObjectStart: true,
          allowObjectEnd: true,
          allowArrayStart: true,
          allowArrayEnd: true
        }
      ]
    }
  }
]
