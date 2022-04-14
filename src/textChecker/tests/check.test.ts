import { check } from '../check'

describe('check 1: I love you', () => {
    const source = 'I love you'

    // 完全一致
    it('test 1.1: I love you', () => {
        const userInput = 'I love you'
        const expected = [{ word: 'I' }, { word: 'love' }, { word: 'you' }]
        const result = check(userInput, source)

        expect(result).toEqual(expected)
    })

    // 忽略大小写
    it('test 1.2: i Love YOU', () => {
        const userInput = 'i Love YOU'
        const expected = [{ word: 'i' }, { word: 'Love' }, { word: 'YOU' }]
        const result = check(userInput, source)

        expect(result).toEqual(expected)
    })

    // misspell
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

    // misspell 后面有一个句号
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

    // 最后一个单词 lack 的情况，标点符号会出现在 lack 的单词后。
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

    // 多个 lack
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

    // 多个 redundant
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

    // lack 一个单词
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

    // 多个 lack
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

    // 1个 redundant + 多个 lack
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

    // 一个 redundant
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

    // 用户换行了
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

// 标点符号
describe('Marks', () => {
    it('; 号应该被忽略', () => {
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

    it(': 号应该被忽略', () => {
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

    it("don't 里的 '", () => {
        const source = "Don't do it"

        const userInput = "Don't do it"
        const expected = [{ word: "Don't" }, { word: 'do' }, { word: 'it' }]
        const result = check(userInput, source)
        expect(result).toEqual(expected)

        const userInput_2 = 'Dont do it'
        const expected_2 = [
            { word: 'Dont', wrongType: 'misspell' },
            { word: 'do' },
            { word: 'it' },
        ]
        const result_2 = check(userInput_2, source)
        expect(result_2).toEqual(expected_2)
    })

    // 技术债
    // it.skip('U.S. is a country', () => {
    //     const source = 'U.S. is a country'

    //     const userInput = 'US is a country'
    //     const expected = [
    //         { word: 'US' },
    //         { word: 'is' },
    //         { word: 'a' },
    //         { word: 'country' },
    //     ]
    //     const result = check(userInput, source)
    //     expect(result).toEqual(expected)
    // })

    it('8,000 dollars', () => {
        const source = '8,000 dollars'

        const userInput = '8,000 dollars'
        const expected = [{ word: '8,000' }, { word: 'dollars' }]
        const result = check(userInput, source)
        expect(result).toEqual(expected)

        // 技术债：下面也应该实现
        // const userInput_2 = '8000 dollars'
        // const expected_2 = [{ word: '8000' }, { word: 'dollars' }]
        // const result_2 = check(userInput_2, source)
        // expect(result_2).toEqual(expected_2)
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
