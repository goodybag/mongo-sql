module.exports = {
  root: true,
  env: {
    node: true,
    mocha: true,
  },
  parserOptions: {
    ecmaVersion: 2018
  },  
  extends: 'eslint:recommended',
  rules: {
    "no-unused-vars": ["error", {args: "none"}],


    "no-useless-escape": ["off"],
  }  
};
