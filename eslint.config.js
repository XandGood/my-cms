import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,vue}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { 
      globals: { ...globals.browser,...globals.node },
      ecmaVersion: 2021,
      sourceType: "module",
     },
     rules: {
  // 移除或改为固定值
  "no-console": "off",
  "no-debugger": "off",
},

 },
    pluginVue.configs["flat/essential"],

]);
