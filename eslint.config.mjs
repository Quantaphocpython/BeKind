import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      'public',
      'src/configs/abi/types',
      '.next',
      'src/server/service/interface',
      'src/components/ui',
    ],
  },

  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      'react/no-unescaped-entities': 'warn',
    },
  },
]

export default eslintConfig
