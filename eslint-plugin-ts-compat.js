import tsEslintPlugin from "@typescript-eslint/eslint-plugin";

const baseRule = tsEslintPlugin.rules["consistent-generic-constructors"];

const consistentGenericConstructors = {
  meta: baseRule.meta,
  create(context) {
    const proxyContext = Object.create(context);
    proxyContext.parserOptions = {
      isolatedDeclarations: false,
      ...(context.parserOptions ?? {}),
    };
    return baseRule.create(proxyContext);
  },
};

export default {
  rules: {
    "consistent-generic-constructors": consistentGenericConstructors,
  },
};
