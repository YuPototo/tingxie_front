import splitSentence, { splitWordByRule } from '../splitSentence'

describe('splitSentence: split by white space', () => {
    it('should split by space', () => {
        const sentence = 'I love you'
        expect(splitSentence(sentence)).toEqual(['I', 'love', 'you'])
    })

    it('should split by many spaces', () => {
        const sentence = 'I  love you'
        expect(splitSentence(sentence)).toEqual(['I', 'love', 'you'])
    })

    it('should trim spaces', () => {
        const sentence = '  I  love you  '
        expect(splitSentence(sentence)).toEqual(['I', 'love', 'you'])
    })
})

describe('splitSentence: split by \n', () => {
    it('should split by \n', () => {
        const sentence = 'I\nyou'
        expect(splitSentence(sentence)).toEqual(['I\n', 'you'])
    })
})

describe('splitSentence: split by " inside element', () => {
    it('normal case', () => {
        const sentence = 'I said, "hello"'
        expect(splitSentence(sentence)).toEqual(['I', 'said,', '"hello"'])
    })

    it('edge case: " inside element', () => {
        const sentence = 'I said,"hello"'
        expect(splitSentence(sentence)).toEqual(['I', 'said,"', 'hello"'])
    })
})

/* helpers */
describe('splitWordByRule: linebreaker', () => {
    it('word without line breaker', () => {
        expect(splitWordByRule('word')).toBeUndefined()
    })

    it('word with linebreaker', () => {
        expect(splitWordByRule('word\nafter')).toEqual(['word\n', 'after'])
    })
})

describe('splitWordByRule: double quotes', () => {
    it('word without splittable double quotes', () => {
        expect(splitWordByRule('Hi')).toBeUndefined()
    })

    it('word with splittable double quotes', () => {
        expect(splitWordByRule('said,"Hi"')).toEqual(['said,"', 'Hi"'])
        expect(splitWordByRule('said:"Hi"')).toEqual(['said:"', 'Hi"'])
        expect(splitWordByRule('said."Hi"')).toEqual(['said."', 'Hi"'])
    })
})

describe('splitWordByRule: other markds', () => {
    it('hyphen', () => {
        expect(splitWordByRule('A-B')).toEqual(['A-', 'B'])
    })

    it('em dash', () => {
        expect(splitWordByRule('A—B')).toEqual(['A—', 'B'])
    })
})
