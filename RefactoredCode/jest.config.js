module.exports = {
  preset: "ts-jest",
  testMatch: ["**/tests/**/*.test.ts"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  reporters: [
    "default",
    ["./node_modules/jest-html-reporter", {
        pageTitle: "Relatório dos Testes Unitários - A3",
        includeFailureMsg: true,
        includConsoleLog: true,
        sort: "titleAsc",
    }]
  ],
};
