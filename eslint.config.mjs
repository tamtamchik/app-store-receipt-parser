import path from "node:path";
import { fileURLToPath } from "node:url";

import globals from "globals";
import stylisticTs from '@stylistic/eslint-plugin-ts'
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...compat.extends("plugin:@typescript-eslint/recommended"),

    {
        plugins: {
            "@stylistic/ts": stylisticTs,
        },
    },

    {
        languageOptions: {
            globals: {
            ...globals.node,
            ...globals.jest,
        },

        parser: tsParser,
        ecmaVersion: 2021,
        sourceType: "module",
    },

    rules: {
        indent: ["error", 2, {
            SwitchCase: 1,
        }],

        semi: "off",
        quotes: "off",
        "object-curly-spacing": "off",

        "@typescript-eslint/array-type": ["error", {
            default: "array",
        }],

        "@stylistic/ts/ban-ts-comment": 0,
        "@stylistic/ts/comma-dangle": ["error", "always-multiline"],
        "@stylistic/ts/quotes": ["error", "single"],
        "@stylistic/ts/semi": ["error", "never"],
        "@stylistic/ts/object-curly-spacing": ["error", "always"],
    },
}];