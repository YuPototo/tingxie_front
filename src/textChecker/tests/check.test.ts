import { check } from '../check'

describe('check: I love you', () => {
    const source = 'I love you'

    // 完全一致
    it('I love you', () => {
        const userInput = 'I love you'
        const expected = [{ text: 'I' }, { text: 'love' }, { text: 'you' }]
        const result = check(userInput, source)

        expect(result).toEqual(expected)
    })

    // 忽略大小写
    it('i Love YOU', () => {
        const userInput = 'i Love YOU'
        const expected = [{ text: 'i' }, { text: 'Love' }, { text: 'YOU' }]
        const result = check(userInput, source)

        expect(result).toEqual(expected)
    })

    // misspell
    it('I love u', () => {
        const userInput = 'I love u'
        const expected = [
            { text: 'I' },
            { text: 'love' },
            { text: 'u', wrongType: 'misspell' },
        ]
        const result = check(userInput, source)

        expect(result).toEqual(expected)
    })

    // misspell 后面有一个句号
    it('I love u.', () => {
        const userInput = 'I love u.'
        const expected = [
            { text: 'I' },
            { text: 'love' },
            { text: 'u.', wrongType: 'misspell' },
        ]
        const result = check(userInput, source)
        expect(result).toEqual(expected)
    })

    it('I love.', () => {
        const userInput = 'I love.'
        const expected = [
            { text: 'I' },
            { text: 'love.' },
            { text: '***', wrongType: 'lack' },
        ]
        const result = check(userInput, source)
        expect(result).toEqual(expected)
    })

    it('love', () => {
        const userInput = 'love'
        const expected = [
            { text: '***', wrongType: 'lack' },
            { text: 'love' },
            { text: '***', wrongType: 'lack' },
        ]
        const result = check(userInput, source)
        expect(result).toEqual(expected)
    })

    it('I red red love you', () => {
        const userInput = 'I red red love you'
        const expected = [
            { text: 'I' },
            { text: 'red', wrongType: 'redundant' },
            { text: 'red', wrongType: 'redundant' },
            { text: 'love' },
            { text: 'you' },
        ]
        const result = check(userInput, source)
        expect(result).toEqual(expected)
    })

    it('I love ', () => {
        const userInput = 'I love '
        const expected = [
            { text: 'I' },
            { text: 'love' },
            { text: '***', wrongType: 'lack' },
        ]
        const result = check(userInput, source)

        expect(result).toEqual(expected)
    })
})

describe('I love you. Do you love me?', () => {
    const source = 'I love you. Do you love me?'

    // 多个 lack
    it('I love you.', () => {
        const userInput = 'I love you.'
        const expected = [
            { text: 'I' },
            { text: 'love' },
            { text: 'you.' },
            { text: '***', wrongType: 'lack' },
            { text: '***', wrongType: 'lack' },
            { text: '***', wrongType: 'lack' },
            { text: '***', wrongType: 'lack' },
        ]
        const result = check(userInput, source)

        expect(result).toEqual(expected)
    })

    // 1个 redundant + 多个 lack
    it('I redundant love you.', () => {
        const userInput = 'I redundant love you.'
        const expected = [
            { text: 'I' },
            { text: 'redundant', wrongType: 'redundant' },
            { text: 'love' },
            { text: 'you.' },
            { text: '***', wrongType: 'lack' },
            { text: '***', wrongType: 'lack' },
            { text: '***', wrongType: 'lack' },
            { text: '***', wrongType: 'lack' },
        ]
        const result = check(userInput, source)
        expect(result).toEqual(expected)
    })

    // 一个 redundant
    it('I love you redundant. Do you love me', () => {
        const userInput = 'I love you redundant. Do you love me'
        const expected = [
            { text: 'I' },
            { text: 'love' },
            { text: 'you' },
            { text: 'redundant.', wrongType: 'redundant' },
            { text: 'Do' },
            { text: 'you' },
            { text: 'love' },
            { text: 'me' },
        ]
        const result = check(userInput, source)
        expect(result).toEqual(expected)
    })

    // 用户换行了
    it('linebreak', () => {
        const userInput = 'I love you.\nDo you love me'
        const expected = [
            { text: 'I' },
            { text: 'love' },
            { text: 'you.\n' },
            { text: 'Do' },
            { text: 'you' },
            { text: 'love' },
            { text: 'me' },
        ]
        const result = check(userInput, source)
        expect(result).toEqual(expected)
    })

    // 用户换行了 2
    it('linebreak', () => {
        const userInput = 'I love u.\nDo you love me'
        const expected = [
            { text: 'I' },
            { text: 'love' },
            { text: 'u.\n', wrongType: 'misspell' },
            { text: 'Do' },
            { text: 'you' },
            { text: 'love' },
            { text: 'me' },
        ]
        const result = check(userInput, source)
        expect(result).toEqual(expected)
    })
})

describe('some random cases', () => {
    it(': 号应该被忽略', () => {
        const source = 'He says: how are you'
        const userInput = 'He says: how are you'
        const expected = [
            { text: 'He' },
            { text: 'says:' },
            { text: 'how' },
            { text: 'are' },
            { text: 'you' },
        ]
        const result = check(userInput, source)
        expect(result).toEqual(expected)

        const userInput2 = 'He says, how are you'
        const expected2 = [
            { text: 'He' },
            { text: 'says,' },
            { text: 'how' },
            { text: 'are' },
            { text: 'you' },
        ]
        const result2 = check(userInput2, source)
        expect(result2).toEqual(expected2)

        const userInput3 = 'He says how are you'
        const expected3 = [
            { text: 'He' },
            { text: 'says' },
            { text: 'how' },
            { text: 'are' },
            { text: 'you' },
        ]
        const result3 = check(userInput3, source)
        expect(result3).toEqual(expected3)
    })

    it("don't: 忽略 '", () => {
        const source = "Don't do it"

        const userInput = "Don't do it"
        const expected = [{ text: "Don't" }, { text: 'do' }, { text: 'it' }]
        const result = check(userInput, source)
        expect(result).toEqual(expected)

        const userInput_2 = 'Dont do it'
        const expected_2 = [{ text: 'Dont' }, { text: 'do' }, { text: 'it' }]
        const result_2 = check(userInput_2, source)
        expect(result_2).toEqual(expected_2)
    })

    it('U.S. is a country: 忽略缩写里的 .', () => {
        const source = 'U.S. is a country'
        const userInput = 'US is a country'
        const expected = [
            { text: 'US' },
            { text: 'is' },
            { text: 'a' },
            { text: 'country' },
        ]
        const result = check(userInput, source)
        expect(result).toEqual(expected)
    })

    it('8,000 dollars', () => {
        const source = '8,000 dollars'
        const userInput = '8,000 dollars'
        const expected = [{ text: '8,000' }, { text: 'dollars' }]
        const result = check(userInput, source)
        expect(result).toEqual(expected)

        const userInput_2 = '8000 dollars'
        const expected_2 = [{ text: '8000' }, { text: 'dollars' }]
        const result_2 = check(userInput_2, source)
        expect(result_2).toEqual(expected_2)
    })
})

describe('Do they own a boat? No, but they like to rent one when they visit the lake.', () => {
    const source =
        'Do they own a boat? No, but they like to rent one when they visit the lake.'

    it('test 1: 简单', () => {
        const userInput =
            'Do they a boat? No. but like to rent one when they visit the lake.'
        const expected = [
            { text: 'Do' },
            { text: 'they' },
            { text: '***', wrongType: 'lack' },
            { text: 'a' },
            { text: 'boat?' },
            { text: 'No.' },
            { text: 'but' },
            { text: '***', wrongType: 'lack' },
            { text: 'like' },
            { text: 'to' },
            { text: 'rent' },
            { text: 'one' },
            { text: 'when' },
            { text: 'they' },
            { text: 'visit' },
            { text: 'the' },
            { text: 'lake.' },
        ]
        const result = check(userInput, source)
        expect(result).toEqual(expected)
    })

    it('test 2', () => {
        const userInput =
            'Do they boat? No. but like to rent one when they visit the lake.'
        const expected = [
            { text: 'Do' },
            { text: 'they' },
            { text: '***', wrongType: 'lack' },
            { text: '***', wrongType: 'lack' },
            { text: 'boat?' },
            { text: 'No.' },
            { text: 'but' },
            { text: '***', wrongType: 'lack' },
            { text: 'like' },
            { text: 'to' },
            { text: 'rent' },
            { text: 'one' },
            { text: 'when' },
            { text: 'they' },
            { text: 'visit' },
            { text: 'the' },
            { text: 'lake.' },
        ]
        const result = check(userInput, source)
        expect(result).toEqual(expected)
    })
})
