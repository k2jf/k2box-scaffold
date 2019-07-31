module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/no-unused-components': 'warning',
    'vue/no-unused-vars': 'warning',
    'vue/require-default-prop': 'warning',
    'vue/require-prop-types': 'warning',
    'vue/no-confusing-v-for-v-if': 'error',
    'vue/no-v-html': 'warning',
    'vue/eqeqeq': 'warning'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
