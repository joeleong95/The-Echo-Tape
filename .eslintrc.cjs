module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  globals: {
    StateModule: 'readonly',
    AudioModule: 'readonly',
    UiModule: 'readonly'
  },
  rules: {
    semi: ['error', 'always'],
    'no-var': 'error'
  }
};
