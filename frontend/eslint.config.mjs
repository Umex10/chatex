import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
 
const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Test and generated files:
    'playwright-report/**',
    'test-results/**',
    'blob-report/**',
    'playwright/.cache/**',
    'playwright/.auth/**',
    '.vitest/**',
    'coverage/**',
    'node_modules/**',
  ]),
])
 
export default eslintConfig