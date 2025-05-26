import { formatDateToInput } from "../src/utils/formatDate"


describe('formatDateToInput', () => {
    const testCases = [
        {
            input: {
                date: '2025-12-25T11:00:00.000Z' // Data qualquer
            },
            expected: '2025-12-25'
        },
        {
            input: { 
                date: '2020-02-29T00:00:00.000Z' }, // Ano bissexto
            expected: '2020-02-29'
        },
        {
            input: { date: '2000-12-31T00:00:00.000Z' }, // Final do ano
            expected: '2000-12-31'
        },
        {
            input: { date: '2022-04-01' }, // Data sem o hora
            expected: '2022-04-01'
        },
    ]

    for (const testCase of testCases){
        test(`case: ${testCase.input.date}`, () => {
            const formattedDate = formatDateToInput(testCase.input.date)
            expect(formattedDate).toEqual(testCase.expected)
        })
    }
})