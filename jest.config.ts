/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest'

const config: Config = {
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testMatch: ['<rootDir>/src/tests/unit/**/*.test.ts', '<rootDir>/src/tests/integration/**/*.test.ts', '<rootDir>/src/tests/**/*.spec.ts'],
  globalSetup: '<rootDir>/jest.global-setup.ts',
  setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.ts'],
}

export default config
