import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  ignores: [
    '**/node_modules/**',
    'apps/web/**',
    '**/.next/**',
    '**/dist/**',
  ],
  rules: {
    'no-console': 'warn',
    'ts/consistent-type-definitions': 'off',
  },
})
