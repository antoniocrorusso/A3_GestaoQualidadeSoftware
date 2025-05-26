module.exports = {
    preset: 'ts-jest',
    testMatch: ['**/*.test.ts'],
    reporters: [
        "default",
        ["./node_modules/jest-html-reporter", {
            pageTitle: "Relatório dos Testes Unitários - A3",
            includeFailureMsg: true,
            includConsoleLog: true,
            sort: 'titleAsc'
        }]
    ]
};