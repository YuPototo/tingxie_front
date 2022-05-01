import compare from '../compare'
import { CleanElement } from '../type'

describe('one element case', () => {
    it('sourceElements 为空：不可能', () => {
        const sourceElements = [] as CleanElement[]

        const userElements = [
            {
                sourceElement: 'hi',
                pureElement: 'hi',
                shouldCompare: true,
            },
        ]
        expect(() => compare(userElements, sourceElements)).toThrowError()
    })

    it('case 2: userEl 不存在，sourceEl 不可比较', () => {
        const sourceElements = [
            { sourceElement: '-', pureElement: '-', shouldCompare: false },
        ]

        const userElements = [] as CleanElement[]

        const expectedResult = [] as CleanElement[]
        expect(compare(userElements, sourceElements)).toEqual(expectedResult)
    })

    it('case 3: userElements 为空，sourceEl 可比较', () => {
        const sourceElements = [
            { sourceElement: 'hi', pureElement: 'hi', shouldCompare: true },
        ]

        const userElements = [] as CleanElement[]

        const expectedResult = [{ text: '***', wrongType: 'lack' }]
        expect(compare(userElements, sourceElements)).toEqual(expectedResult)
    })

    it('case 6: userEl 和 sourceEl 都不可比较', () => {
        const sourceElements = [
            { sourceElement: '-', pureElement: '-', shouldCompare: false },
        ]

        const userElements = [
            { sourceElement: '-', pureElement: '-', shouldCompare: false },
        ]

        const expectedResult = [
            {
                text: '-',
            },
        ]
        expect(compare(userElements, sourceElements)).toEqual(expectedResult)
    })

    it('case 8: useEl 不可比较, sourceEl 可以比较', () => {
        const sourceElements = [
            { sourceElement: 'hi', pureElement: 'hi', shouldCompare: true },
        ]

        const userElements = [
            { sourceElement: '-', pureElement: '-', shouldCompare: false },
        ]

        const expectedResult = [
            {
                text: '-',
            },
            { text: '***', wrongType: 'lack' },
        ]
        expect(compare(userElements, sourceElements)).toEqual(expectedResult)
    })

    it('case 9.1: misspell', () => {
        const sourceElements = [
            { sourceElement: 'a', pureElement: 'a', shouldCompare: true },
        ]

        const userElements = [
            { sourceElement: 'b', pureElement: 'b', shouldCompare: true },
        ]

        const expectedResult = [
            {
                text: 'b',
                wrongType: 'misspell',
            },
        ]
        expect(compare(userElements, sourceElements)).toEqual(expectedResult)
    })

    it('case 9.2: right one', () => {
        const sourceElements = [
            { sourceElement: 'hi', pureElement: 'hi', shouldCompare: true },
        ]

        const userElements = [
            { sourceElement: 'hi', pureElement: 'hi', shouldCompare: true },
        ]

        const expectedResult = [
            {
                text: 'hi',
            },
        ]
        expect(compare(userElements, sourceElements)).toEqual(expectedResult)
    })
})

describe('two elements case', () => {
    it('two matches', () => {
        const sourceElements = [
            { sourceElement: 'hi', pureElement: 'hi', shouldCompare: true },
            { sourceElement: 'you', pureElement: 'you', shouldCompare: true },
        ]

        const userElements = [
            { sourceElement: 'hi', pureElement: 'hi', shouldCompare: true },
            { sourceElement: 'you', pureElement: 'you', shouldCompare: true },
        ]

        const expectedResult = [
            {
                text: 'hi',
            },
            {
                text: 'you',
            },
        ]
        expect(compare(userElements, sourceElements)).toEqual(expectedResult)
    })

    it('empty user elements', () => {
        const sourceElements = [
            { sourceElement: 'hi', pureElement: 'hi', shouldCompare: true },
            { sourceElement: 'you', pureElement: 'you', shouldCompare: true },
        ]

        const userElements = [] as CleanElement[]

        const expectedResult = [
            { text: '***', wrongType: 'lack' },
            { text: '***', wrongType: 'lack' },
        ]
        expect(compare(userElements, sourceElements)).toEqual(expectedResult)
    })

    it('user element lack second word', () => {
        const sourceElements = [
            { sourceElement: 'hi', pureElement: 'hi', shouldCompare: true },
            { sourceElement: 'you', pureElement: 'you', shouldCompare: true },
        ]

        const userElements = [
            { sourceElement: 'hi', pureElement: 'hi', shouldCompare: true },
        ]

        const expectedResult = [
            {
                text: 'hi',
            },
            { text: '***', wrongType: 'lack' },
        ]
        expect(compare(userElements, sourceElements)).toEqual(expectedResult)
    })

    it('user element lack first word', () => {
        const sourceElements = [
            { sourceElement: 'hi', pureElement: 'hi', shouldCompare: true },
            { sourceElement: 'you', pureElement: 'you', shouldCompare: true },
        ]

        const userElements = [
            { sourceElement: 'you', pureElement: 'you', shouldCompare: true },
        ]

        const expectedResult = [
            { text: '***', wrongType: 'lack' },
            {
                text: 'you',
            },
        ]

        expect(compare(userElements, sourceElements)).toEqual(expectedResult)
    })
})

describe('Three elements case: I love you', () => {
    const source: CleanElement[] = [
        { pureElement: 'i', sourceElement: 'I', shouldCompare: true },
        { pureElement: 'love', sourceElement: 'love', shouldCompare: true },
        { pureElement: 'you', sourceElement: 'you.', shouldCompare: true },
    ]

    it('I love u', () => {
        const userElements = [
            { pureElement: 'i', sourceElement: 'I', shouldCompare: true },
            { pureElement: 'love', sourceElement: 'love', shouldCompare: true },
            { pureElement: 'u', sourceElement: 'u.', shouldCompare: true },
        ]

        const expected = [
            { text: 'I' },
            { text: 'love' },
            { text: 'u.', wrongType: 'misspell' },
        ]

        const result = compare(userElements, source)

        expect(result).toEqual(expected)
    })

    it('love you', () => {
        const userElements = [
            { pureElement: 'love', sourceElement: 'love', shouldCompare: true },
            { pureElement: 'you', sourceElement: 'you.', shouldCompare: true },
        ]

        const expected = [
            { text: '***', wrongType: 'lack' },
            { text: 'love' },
            { text: 'you.' },
        ]

        const result = compare(userElements, source)

        expect(result).toEqual(expected)
    })

    it('I love.', () => {
        // 这里做了个减法，不再追求正确处理标点符号
        const userElements = [
            { pureElement: 'i', sourceElement: 'I', shouldCompare: true },
            {
                pureElement: 'love',
                sourceElement: 'love.',
                shouldCompare: true,
            },
        ]

        const expected = [
            { text: 'I' },
            { text: 'love.' },
            { text: '***', wrongType: 'lack' },
        ]

        const result = compare(userElements, source)

        expect(result).toEqual(expected)
    })

    it('I love you too', () => {
        const userElements = [
            { pureElement: 'i', sourceElement: 'I', shouldCompare: true },
            {
                pureElement: 'love',
                sourceElement: 'love',
                shouldCompare: true,
            },
            {
                pureElement: 'you',
                sourceElement: 'you',
                shouldCompare: true,
            },
            {
                pureElement: 'too',
                sourceElement: 'too.',
                shouldCompare: true,
            },
        ]

        const expected = [
            { text: 'I' },
            { text: 'love' },
            { text: 'you' },
            { text: 'too.', wrongType: 'redundant' },
        ]

        const result = compare(userElements, source)
        expect(result).toEqual(expected)
    })
})

describe('5 elements case: I love you very much', () => {
    const source: CleanElement[] = [
        { pureElement: 'i', sourceElement: 'I', shouldCompare: true },
        { pureElement: 'love', sourceElement: 'love', shouldCompare: true },
        { pureElement: 'you', sourceElement: 'you', shouldCompare: true },
        { pureElement: 'very', sourceElement: 'very', shouldCompare: true },
        { pureElement: 'much', sourceElement: 'much.', shouldCompare: true },
    ]

    it('I loved you very', () => {
        const userElements = [
            { pureElement: 'i', sourceElement: 'I', shouldCompare: true },
            {
                pureElement: 'loved',
                sourceElement: 'loved',
                shouldCompare: true,
            },
            { pureElement: 'you', sourceElement: 'you', shouldCompare: true },
            { pureElement: 'very', sourceElement: 'very', shouldCompare: true },
        ]
        const expected = [
            { text: 'I' },
            { text: 'loved', wrongType: 'misspell' },
            { text: 'you' },
            { text: 'very' },
            { text: '***', wrongType: 'lack' },
        ]

        const result = compare(userElements, source)
        expect(result).toEqual(expected)
    })

    it('love', () => {
        const userElements = [
            { pureElement: 'love', sourceElement: 'love', shouldCompare: true },
        ]
        const expected = [
            { text: '***', wrongType: 'lack' },
            { text: 'love' },
            { text: '***', wrongType: 'lack' },
            { text: '***', wrongType: 'lack' },
            { text: '***', wrongType: 'lack' },
        ]
        const result = compare(userElements, source)
        expect(result).toEqual(expected)
    })
})
