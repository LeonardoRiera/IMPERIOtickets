import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,jsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules:{
      "react/prop-types": "off",
      "indent":["error", 2],
      "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1 }],
      "react/jsx-no-useless-fragment": ["error"],
      "react/jsx-newline": ["error", { "prevent": false }],
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        { blankLine: "always", prev: "*", next: ["return", "if", "for", "while", "switch", "function"] },
        { blankLine: "always", prev: ["if", "for", "while", "switch", "function"], next: "*" },
        { blankLine: "never", prev: "import", next: "import" },
        { blankLine: "always", prev: "block", next: "block" }
      ],
      "no-trailing-spaces": "error",
      "spaced-comment": ["error", "always"],
      "space-in-parens": ["error", "never"],
      "brace-style": ["error", "1tbs", { "allowSingleLine": true }]
    }
  }
];