const path = require('node:path');
const createAliasSetting = require('@vue/eslint-config-airbnb/createAliasSetting');

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-airbnb',
  ],
  // parserOptions: {
  //   parser: 'babel-eslint',
  // },
  rules: {
    curly: ['error', 'all'],
    'linebreak-style': 'off',
    'max-len': 'warn',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-promise-executor-return': 'warn',
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
    'no-underscore-dangle': 'off',
    'vuejs-accessibility/form-control-has-label': 'warn',
    'vue/valid-v-model': 'warn',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
  settings: {
    ...createAliasSetting({
      '@': `${path.resolve(__dirname, './src')}`,
    }),
  },
};
