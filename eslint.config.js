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
  },
  {
    name: '4th-motion/wordpress-backend',
    files: ['**/scripts/backend/**/*.js'],
    languageOptions: {
      globals: {
        acf: 'readonly',
        ajaxurl: 'readonly',
        jQuery: 'readonly',
        tinymce: 'readonly',
        wp: 'readonly'
      }
    },
    rules: {
      'func-names': 'off',
      'no-alert': 'off',
      'no-await-in-loop': 'off',
      'no-console': 'off',
      'no-param-reassign': ['error', { props: false }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message:
            'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.'
        },
        {
          selector: 'LabeledStatement',
          message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.'
        },
        {
          selector: 'WithStatement',
          message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.'
        }
      ],
      'no-underscore-dangle': 'off',
      'no-use-before-define': ['error', { functions: false, classes: true, variables: true }]
    }
  }
]
