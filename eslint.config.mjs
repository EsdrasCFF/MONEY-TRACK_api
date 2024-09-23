import pluginJs from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettierPlugin from 'eslint-plugin-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import jestPlugin from 'eslint-plugin-jest'

// Configuração Flat
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    ignores: ['node_modules'],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
      jest: jestPlugin,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      'prettier/prettier': 'error', // Ativa o Prettier como uma regra de ESLint,
      'simple-import-sort/exports': 'warn', // Adiciona a regra para organizar exportações
      'simple-import-sort/imports': 'warn', // Adiciona a regra para organizar importações
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
]
