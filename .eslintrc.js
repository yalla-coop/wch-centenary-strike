module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    "no-unused-vars": "off",
    'no-debugger': process.env.VUE_APP_ENV === 'DEV' ? 'warn' : 'error',
  }
}
