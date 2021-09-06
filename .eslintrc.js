module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    // 关闭TS any检测
    '@typescript-eslint/no-explicit-any': ['off'],
    // 关闭TS 空函数检测
    '@typescript-eslint/no-empty-function': ['off'],
    // 关闭tab检测
    'no-tabs': 'off',
    // 关闭对象属性取用是必须是.的形式调用
    'dot-notation': 'off',
    // 关闭函数必须声明返回值
    // '@typescript-eslint/explicit-module-boundary-types': 'off'
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
