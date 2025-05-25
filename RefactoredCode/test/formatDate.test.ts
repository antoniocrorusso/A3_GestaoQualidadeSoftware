import { formatDateToInput } from "../src/utils/formatDate"


describe('formatDateToInput', () => {
    const testCases = [
        {
            input: {
                date: '2025-12-25T11:00:00.000Z'
            },
            expected: '2025-12-25'
        }
    ]

    for (const testCase of testCases){
        test(`case: ${testCase.input.date}`, () => {
            const formattedDate = formatDateToInput(testCase.input.date)
            expect(formattedDate).toEqual(testCase.expected)
        })
    }
})