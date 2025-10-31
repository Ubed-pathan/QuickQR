// ESLint 9 flat config for Next.js 15
import next from 'eslint-config-next';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Ignore build artifacts
  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**', 'build/**']
  },
  // Next.js recommended + Core Web Vitals
  ...next(),
];
