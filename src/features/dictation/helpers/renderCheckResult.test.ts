import { CheckedResult } from '../../../textChecker'
import { renderCheckResult, processCheckWord } from './renderCheckResult'

describe('processCheckWord', () => {
    it('just word', () => {
        expect(processCheckWord({ text: 'Hi' })).toBe('Hi')
    })

    it('word with misspell', () => {
        expect(processCheckWord({ text: 'Hi', wrongType: 'misspell' })).toBe(
            '<span class="text-red-500">Hi</span>'
        )
    })

    it('word with lack', () => {
        expect(processCheckWord({ text: '***', wrongType: 'lack' })).toBe(
            '<span class="text-yellow-600">***</span>'
        )
    })

    it('word with redundant', () => {
        expect(processCheckWord({ text: 'abc', wrongType: 'redundant' })).toBe(
            '<span class="text-gray-500 line-through">abc</span>'
        )
    })
})

describe('renderCheckResult', () => {
    it('combine words, no mark', () => {
        const checkResult = [{ text: 'I' }, { text: 'love' }, { text: 'you' }]
        expect(renderCheckResult(checkResult)).toBe('I love you')
    })

    it('combine words, with mark', () => {
        const checkResult = [{ text: 'I' }, { text: 'love' }, { text: 'you.' }]
        expect(renderCheckResult(checkResult)).toBe('I love you.')
    })

    it('combine words, misspell', () => {
        const checkResult: CheckedResult = [
            { text: 'I' },
            { text: 'love' },
            { text: 'u', wrongType: 'misspell' },
        ]
        expect(renderCheckResult(checkResult)).toBe(
            'I love <span class="text-red-500">u</span>'
        )
    })
})
