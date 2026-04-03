import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";
import tsEslintPlugin from "@typescript-eslint/eslint-plugin";

const baseRule = tsEslintPlugin.rules["consistent-generic-constructors"];
const tsCompat = {
  rules: {
    "consistent-generic-constructors": {
      meta: baseRule.meta,
      create(context) {
        const proxyContext = Object.create(context);
        proxyContext.parserOptions = { isolatedDeclarations: false, ...(context.parserOptions ?? {}) };
        return baseRule.create(proxyContext);
      },
    },
  },
};

export default [
  {
    ignores: ["coverage/", "dist/", "docs/testdata/", "docs/screenshots/prepare.js", "src/assets/webfonts/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ...config.languageOptions,
      parser: tseslint.parser,
      parserOptions: {
        projectService: { allowDefaultProject: ["vite.config.ts", "jest.config.ts", "docs/*.ts"] },
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
        projectService: { allowDefaultProject: ["vite.config.ts", "jest.config.ts", "docs/*.ts"] },
      },
    },
  })),
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: { allowDefaultProject: ["vite.config.ts", "jest.config.ts", "docs/*.ts"] },
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
      "react-hooks": reactHooks,
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
      "react-hooks/exhaustive-deps": "error",
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
      // eslint-plugin-import@2.32.0 is not compatible with ESLint 10 (see TypeError in lint output).
      // Re-enable when the plugin supports ESLint 10.
      "import/order": "off",
    },
  },
];
