module.exports = {
  extends: ['airbnb-base/legacy', 'plugin:prettier/recommended'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    requireConfigFile: false
  },
  env: {
    browser: true,
    es6: true
  },
  ignorePatterns: ['**/node_modules/', '**/.next/', '**/.out/', '**/build/', '**/dist/'],
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
