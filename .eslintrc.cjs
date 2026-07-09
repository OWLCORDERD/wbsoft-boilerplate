module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint', 'ban'],
  extends: [
    // 'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:prettier/recommended',
  ],
  rules: {
    'vue/no-unused-vars': ['warn', { ignorePattern: '^_' }],
    'vue/multi-word-component-names': 'off',
    'vue/no-mutating-props': 'warn',
    'vue/require-toggle-inside-transition': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    // 'prettier/prettier': 'warn',
  },
};
