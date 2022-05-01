import { CleanElement } from './type'

/*
    将句子里的一个元素变为 CleanElement
*/
export default function cleanseElement(sentenceElement: string): CleanElement {
    const replacibleRegex = new RegExp(
        [
            '[',
            ',', // comma
            "'", // single quote
            '"', // double quote
            '.', // period
            '\\-', // hyphen，在 regex 里有特殊的意义，需要 escape
            '—', // em dash
            ':',
            '\\?',
            '\\!',
            '\\n',
            ']',
        ].join(''),
        'g'
    )
    const pureElement = sentenceElement
        .replaceAll(replacibleRegex, '')
        .toLowerCase()

    const shouldCompare = pureElement !== ''

    return {
        sourceElement: sentenceElement,
        pureElement,
        shouldCompare,
    }
}
