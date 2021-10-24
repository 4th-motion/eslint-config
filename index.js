module.exports = {
  extends: ['airbnb-base/legacy', 'eslint-config-prettier', 'eslint-config-preact', 'prettier'],
  parser: '@babel/eslint-parser',
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  env: {
    browser: true,
    es6: true
  },
  ignorePatterns: ['**/node_modules/', '**/.next/', '**/.out/', '**/build/', '**/dist/'],
  rules: {
    'prettier/prettier': 'error',
    'no-param-reassign:': 0,
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 4 }],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
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
