import { check } from '../check'

describe('check 1: I love you', () => {
    const source = 'I love you'

    it('test 1.1: I love you', () => {
        const userInput = 'I love you'
        const expected = [{ word: 'I' }, { word: 'love' }, { word: 'you' }]
        const result = check(userInput, source)

        expect(result).toEqual(expected)
    })

    it('test 1.2: i Love YOU', () => {
        const userInput = 'i Love YOU'
        const expected = [{ word: 'i' }, { word: 'Love' }, { word: 'YOU' }]
        const result = check(userInput, source)

        expect(result).toEqual(expected)
    })

    it('test 1.3: I love u', () => {
        const userInput = 'I love u'
        const expected = [
            { word: 'I' },
            { word: 'love' },
            { word: 'u', wrongType: 'misspell' },
        ]
        const result = check(userInput, source)

        expect(result).toEqual(expected)
    })

    it('test 1.4: I love u.', () => {
        const userInput = 'I love u.'
        const expected = [
            { word: 'I' },
            { word: 'love' },
            { word: 'u', wrongType: 'misspell', markAfter: '.' },
        ]
        const result = check(userInput, source)

        expect(result).toEqual(expected)
    })

    it('test 1.5: I love.', () => {
        const userInput = 'I love.'
        const expected = [
            { word: 'I' },
            { word: 'love' },
            { word: '***', wrongType: 'lack', markAfter: '.' },
        ]
        const result = check(userInput, source)

        expect(result).toEqual(expected)
    })

    it('test 1.6: love', () => {
        const userInput = 'love'
        const expected = [
            { word: '***', wrongType: 'lack' },
            { word: 'love' },
            { word: '***', wrongType: 'lack' },
        ]
        const result = check(userInput, source)

        expect(result).toEqual(expected)
    })

    it('I red red love you', () => {
        const userInput = 'I red red love you'
        const expected = [
            { word: 'I' },
            { word: 'red', wrongType: 'redundant' },
            { word: 'red', wrongType: 'redundant' },
            { word: 'love' },
            { word: 'you' },
        ]
        const result = check(userInput, source)

        expect(result).toEqual(expected)
    })

    it('I love ', () => {
        const userInput = 'I love '
        const expected = [
            { word: 'I' },
            { word: 'love' },
            { word: '***', wrongType: 'lack' },
        ]
        const result = check(userInput, source)

        expect(result).toEqual(expected)
    })
})

describe('I love you. Do you love me?', () => {
    const source = 'I love you. Do you love me?'

    it('case: I love you.', () => {
        const userInput = 'I love you.'
        const expected = [
            { word: 'I' },
            { word: 'love' },
            { word: 'you', markAfter: '.' },
            { word: '***', wrongType: 'lack' },
            { word: '***', wrongType: 'lack' },
            { word: '***', wrongType: 'lack' },
            { word: '***', wrongType: 'lack' },
        ]
        const result = check(userInput, source)

        expect(result).toEqual(expected)
    })

    it('case: I redundant love you.', () => {
        const userInput = 'I redundant love you.'
        const expected = [
            { word: 'I' },
            { word: 'redundant', wrongType: 'redundant' },
            { word: 'love' },
            { word: 'you', markAfter: '.' },
            { word: '***', wrongType: 'lack' },
            { word: '***', wrongType: 'lack' },
            { word: '***', wrongType: 'lack' },
            { word: '***', wrongType: 'lack' },
        ]
        const result = check(userInput, source)
        expect(result).toEqual(expected)
    })

    it('case: I love you redundant. Do you love me', () => {
        const userInput = 'I love you redundant. Do you love me'
        const expected = [
            { word: 'I' },
            { word: 'love' },
            { word: 'you' },
            { word: 'redundant', wrongType: 'redundant', markAfter: '.' },
            { word: 'Do' },
            { word: 'you' },
            { word: 'love' },
            { word: 'me' },
        ]
        const result = check(userInput, source)
        expect(result).toEqual(expected)
    })

    it('case: linbreak', () => {
        const userInput = 'I love u.\nDo you love me'
        const expected = [
            { word: 'I' },
            { word: 'love' },
            { word: 'u', markAfter: '.\n', wrongType: 'misspell' },
            { word: 'Do' },
            { word: 'you' },
            { word: 'love' },
            { word: 'me' },
        ]
        const result = check(userInput, source)
        expect(result).toEqual(expected)
    })
})

describe('Marks', () => {
    it('case: ;', () => {
        const source = 'I love you; Do you love me?'
        const userInput = 'I love you. Do you love me'
        const expected = [
            { word: 'I' },
            { word: 'love' },
            { word: 'you', markAfter: '.' },
            { word: 'Do' },
            { word: 'you' },
            { word: 'love' },
            { word: 'me' },
        ]
        const result = check(userInput, source)
        expect(result).toEqual(expected)
    })

    it('case: "', () => {
        const source = 'He says: how are you'
        const userInput = 'He says: how are you'
        const expected = [
            { word: 'He' },
            { word: 'says', markAfter: ':' },
            { word: 'how' },
            { word: 'are' },
            { word: 'you' },
        ]
        const result = check(userInput, source)
        expect(result).toEqual(expected)

        const userInput2 = 'He says, how are you'
        const expected2 = [
            { word: 'He' },
            { word: 'says', markAfter: ',' },
            { word: 'how' },
            { word: 'are' },
            { word: 'you' },
        ]
        const result2 = check(userInput2, source)
        expect(result2).toEqual(expected2)

        const userInput3 = 'He says how are you'
        const expected3 = [
            { word: 'He' },
            { word: 'says' },
            { word: 'how' },
            { word: 'are' },
            { word: 'you' },
        ]
        const result3 = check(userInput3, source)
        expect(result3).toEqual(expected3)
    })
})

// describe('Do they own a boat? No, but they like to rent one when they visit the lake.', () => {
//     const source =
//         'Do they own a boat? No, but they like to rent one when they visit the lake.'
//     it('test 1', () => {
//         const userInput =
//             'Do they a boated? No. but like to rent one when they visit the lake.'
//         const expected = [
//             { word: 'Do' },
//             { word: 'they' },
//             { word: '***', wrongType: 'lack' },
//             { word: 'a' },
//             { word: 'boated', wrongType: 'misspell', markAfter: '?' },
//             { word: 'No', markAfter: '.' },
//             { word: 'but' },
//             { word: '***', wrongType: 'lack' },
//             { word: 'like' },
//             { word: 'to' },
//             { word: 'rent' },
//             { word: 'one' },
//             { word: 'when' },
//             { word: 'they' },
//             { word: 'visit' },
//             { word: 'the' },
//             { word: 'lake', markAfter: '.' },
//         ]
//         const result = check(userInput, source)
//         expect(result).toEqual(expected)
//     })
// })
