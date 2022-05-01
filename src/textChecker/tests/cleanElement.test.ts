import cleanseElement from '../cleanseElement'

it('simple element', () => {
    expect(cleanseElement('word')).toEqual({
        sourceElement: 'word',
        pureElement: 'word',
        shouldCompare: true,
    })
})

describe('to lower case', () => {
    it('Word', () => {
        expect(cleanseElement('Word')).toEqual({
            sourceElement: 'Word',
            pureElement: 'word',
            shouldCompare: true,
        })
    })

    it('WORD', () => {
        expect(cleanseElement('WORD')).toEqual({
            sourceElement: 'WORD',
            pureElement: 'word',
            shouldCompare: true,
        })
    })
})

describe('remove all marks in words', () => {
    it('single quotes', () => {
        expect(cleanseElement("don't")).toEqual({
            sourceElement: "don't",
            pureElement: 'dont',
            shouldCompare: true,
        })
    })

    it('double quotes', () => {
        expect(cleanseElement('"hi"')).toEqual({
            sourceElement: '"hi"',
            pureElement: 'hi',
            shouldCompare: true,
        })
    })

    it('comma', () => {
        expect(cleanseElement('said,')).toEqual({
            sourceElement: 'said,',
            pureElement: 'said',
            shouldCompare: true,
        })

        expect(cleanseElement('1,200')).toEqual({
            sourceElement: '1,200',
            pureElement: '1200',
            shouldCompare: true,
        })
    })

    it('period', () => {
        expect(cleanseElement('hi.')).toEqual({
            sourceElement: 'hi.',
            pureElement: 'hi',
            shouldCompare: true,
        })

        expect(cleanseElement('1.25')).toEqual({
            sourceElement: '1.25',
            pureElement: '125',
            shouldCompare: true,
        })
    })

    it('hyphen', () => {
        expect(cleanseElement('ex-wife')).toEqual({
            sourceElement: 'ex-wife',
            pureElement: 'exwife',
            shouldCompare: true,
        })
    })

    it('em dash', () => {
        expect(cleanseElement('a—')).toEqual({
            sourceElement: 'a—',
            pureElement: 'a',
            shouldCompare: true,
        })
    })

    it('question mark', () => {
        expect(cleanseElement('me?')).toEqual({
            sourceElement: 'me?',
            pureElement: 'me',
            shouldCompare: true,
        })
    })

    it('exclamation mark', () => {
        expect(cleanseElement('me!')).toEqual({
            sourceElement: 'me!',
            pureElement: 'me',
            shouldCompare: true,
        })
    })
})

describe('special case', () => {
    it('linebreak', () => {
        expect(cleanseElement('a.\n')).toEqual({
            sourceElement: 'a.\n',
            pureElement: 'a',
            shouldCompare: true,
        })
    })
})

describe("elements that shouldn't compare", () => {
    it('em dash', () => {
        expect(cleanseElement('—')).toEqual({
            sourceElement: '—',
            pureElement: '',
            shouldCompare: false,
        })
    })
})
