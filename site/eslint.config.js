import js from "@eslint/js"
import globals from "globals"
import hooks from "eslint-plugin-react-hooks"
import tseslint from "typescript-eslint"

export default tseslint.config(
  { ignores: ["dist/**", "public/**", "src/generated/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { "react-hooks": hooks },
    rules: { ...hooks.configs.recommended.rules },
  },
  {
    files: ["src/components/ui/**"],
    rules: { "@typescript-eslint/no-empty-object-type": "off" },
  },
)
