import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";
import tsCompat from "./eslint-plugin-ts-compat.js";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default [
  {
    ignores: ["coverage/", "dist/", "testdata/"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ...config.languageOptions,
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: projectRoot,
      },
    },
  })),
  ...tseslint.configs.stylistic.map(config => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ...config.languageOptions,
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: projectRoot,
      },
    },
  })),
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: projectRoot,
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
      "unused-imports": unusedImports,
      "ts-compat": tsCompat,
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
    },
    rules: {
      "@typescript-eslint/consistent-generic-constructors": "off",
      "ts-compat/consistent-generic-constructors": "error",
      "prettier/prettier": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            "**/vite.config.ts",
            "**/jest.setup.ts",
            "**/*.test.ts",
            "**/*.test.tsx",
          ],
        },
      ],
      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
            caseInsensitive: false,
          },
          "newlines-between": "always",
          groups: ["external", "builtin", "internal", ["parent", "sibling", "index"]],
        },
      ],
    },
  },
];
