module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "airbnb-base",
    "airbnb-typescript/base"
  ],
  overrides: [
  ],
  ignorePatterns: ["webpack.config.js", ".eslintrc.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ['./tsconfig.json'],
  },
  plugins: [
    "@typescript-eslint",
  ],
  rules: {
    'max-len': ["error", { "code": 120 }],
    "no-underscore-dangle": 'off',
    "func-names": 'off'
  }
};
