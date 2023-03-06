module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  overrides: [
  ],
  ignorePatterns: ["webpack.config.js", ".eslintrc.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
  ],
  rules: {
    indent: [
      "error",
      2,
    ],
    "linebreak-style": [
      "error",
      "unix",
    ],
    quotes: [
      "error",
      "single",
    ],
    semi: [
      "error",
      "always",
    ],
    "no-multi-spaces": [
      "error",
    ],
    "no-trailing-spaces": [
      "error",
    ],
    "keyword-spacing": [
      "error",
    ],
    "array-bracket-spacing": [
      "error",
      "never",
    ],
    "object-curly-spacing": [
      "error",
      "always",
    ],
    "comma-spacing": [
      "error",
    ],
    "space-infix-ops": [
      "error",
    ],
    // "max-len": ["error", { "code": 80,"tabWidth": 4 }],
    // "padding-line-between-statements": [ "error", 
    // { blankLine: "always", prev: ["const", "let", "var"], next: "*"},
    // { blankLine: "any",    prev: ["const", "let", "var"], next: ["const", "let", "var"]},
    // { blankLine: "always", prev: "*", next: "return" }
  // ],
  },
};
