const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  clearMocks: true,
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "config/**/*.ts",
    "features/**/*.{ts,tsx}",
    "lib/**/*.ts",
    "middleware.ts",
    "!**/*.d.ts",
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  modulePathIgnorePatterns: ["<rootDir>/.next/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setup/jest.setup.ts"],
  testEnvironment: "node",
};

module.exports = createJestConfig(config);
