module.exports = {
  root: true,
  env: {
    node: true,
    mocha: true,
  },
  parserOptions: {
    ecmaVersion: 2016
  },  
  extends: 'eslint:recommended',
  rules: {
    "no-unused-vars": ["error", {args: "none"}],
  }  
};
