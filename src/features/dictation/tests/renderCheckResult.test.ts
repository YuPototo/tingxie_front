import { renderCheckResult, processCheckWord } from '../renderCheckResult'

describe('processCheckWord', () => {
    it('just word', () => {
        expect(processCheckWord({ word: 'Hi' })).toBe('Hi')
    })

    it('word with mark', () => {
        expect(processCheckWord({ word: 'Hi', markAfter: '.' })).toBe('Hi.')
    })

    it('word with misspell', () => {
        expect(processCheckWord({ word: 'Hi', wrongType: 'misspell' })).toBe(
            '<span class="text-red-500">Hi</span>'
        )
    })

    it('word with lack', () => {
        expect(processCheckWord({ word: '***', wrongType: 'lack' })).toBe(
            '<span class="text-yellow-600">***</span>'
        )
    })

    it('word with redundant', () => {
        expect(processCheckWord({ word: 'abc', wrongType: 'redundant' })).toBe(
            '<span class="text-gray-500 line-through">abc</span>'
        )
    })
})

describe('renderCheckResult', () => {
    it('combine words, no mark', () => {
        const checkResult = [{ word: 'I' }, { word: 'love' }, { word: 'you' }]
        expect(renderCheckResult(checkResult)).toBe('I love you')
    })

    it('combine words, with mark', () => {
        const checkResult = [
            { word: 'I' },
            { word: 'love' },
            { word: 'you', markAfter: '.' },
        ]
        expect(renderCheckResult(checkResult)).toBe('I love you.')
    })

    it('combine words, misspell', () => {
        const checkResult = [
            { word: 'I' },
            { word: 'love' },
            { word: 'u', wrongType: 'misspell' },
        ]
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        expect(renderCheckResult(checkResult)).toBe(
            'I love <span class="text-red-500">u</span>'
        )
    })

    it('combine words, misspell and mark', () => {
        const checkResult = [
            { word: 'I' },
            { word: 'love' },
            { word: 'u', wrongType: 'misspell', markAfter: '.' },
        ]
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        expect(renderCheckResult(checkResult)).toBe(
            'I love <span class="text-red-500">u</span>.'
        )
    })

    it('words with lack', () => {
        const checkResult = [
            { word: 'I' },
            { word: 'love' },
            { word: '***', wrongType: 'lack', markAfter: '.' },
        ]
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        expect(renderCheckResult(checkResult)).toBe(
            'I love <span class="text-yellow-600">***</span>.'
        )
    })

    it('words with redundant', () => {
        const checkResult = [
            { word: 'I' },
            { word: 'love' },
            { word: 'you' },
            { word: 'haha', wrongType: 'redundant', markAfter: '.' },
        ]
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        expect(renderCheckResult(checkResult)).toBe(
            'I love you <span class="text-gray-500 line-through">haha</span>.'
        )
    })
})
