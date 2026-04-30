import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'node_modules/**',
    'dist/**',
    'artifacts/**',
    'test-results/**',
    'playwright-report/**',
    'responsive-proof-v3/**',
    'responsive-proof-v4/**',
    '*.log',
    'src/components/BottleAssemblyScroll.tsx',
    'src/components/Hero3DScene.tsx',
    'src/components/PerfumeBottle3D.tsx',
    'src/components/Product3DViewer.tsx',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])
