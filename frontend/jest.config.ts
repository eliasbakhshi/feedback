import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { 
      tsconfig: "<rootDir>/jest.tsconfig.json"
    }]
  },
  setupFiles: ["whatwg-fetch"],
  setupFilesAfterEnv: ["<rootDir>/test/setupTests.ts"],
  moduleNameMapper: {
    "\\.(css|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/test/__mocks__/fileMock.js"
  }
};

export default config;
