import { formatDateToInput } from "../../src/utils/formatDate"

describe('formatDateToInput', () => {
    const testCasesParameters = [
        {
            input: {
                date: '2025-12-25T11:00:00.000Z' // Any date
            },
            expected: '2025-12-25'
        },
        {
            input: { 
                date: '2020-02-29T00:00:00.000Z' }, // Leap Year
            expected: '2020-02-29'
        },
        {
            input: { date: '2000-12-31T00:00:00.000Z' }, // Last day of year
            expected: '2000-12-31'
        },
        {
            input: { date: '2022-04-01' }, // Date with no time
            expected: '2022-04-01'
        },
    ];

    for (const testCase of testCasesParameters){
        test(`test case: ${testCase.input.date}`, () => {
            const formattedDate = formatDateToInput(testCase.input.date)
            expect(formatDateToInput(formattedDate)).toMatch(/^\d{4}-\d{2}-\d{2}$/); // Expected answer for each test case parameter done here. 
        });
    };
});