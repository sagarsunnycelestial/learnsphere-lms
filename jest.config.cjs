const { createDefaultEsmPreset } = require("ts-jest");

const preset = createDefaultEsmPreset({
  tsconfig: "./server/tsconfig.json",
});

/** @type {import("jest").Config} */
module.exports = {
  rootDir: ".",
  testEnvironment: "node",

  transform: preset.transform,

  extensionsToTreatAsEsm: [".ts"],

  testMatch: ["<rootDir>/server/src/**/*.test.ts"],
};