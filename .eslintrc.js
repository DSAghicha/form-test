modules.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    rules: {
        "@typescript-eslint/no-explicit-any": "off",
    },
    extends: ["plugin:@typescript-eslint/recommended"],
    env: {
        node: true,
    },
};
