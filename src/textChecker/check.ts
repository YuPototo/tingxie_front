import cleanseElement from './cleanseElement'
import compare from './compare'
import splitSentence from './splitSentence'
import type { CheckedResult } from './type'

export function check(userInput: string, source: string): CheckedResult {
    const userElements = splitSentence(userInput).map(cleanseElement)
    const sourceElements = splitSentence(source).map(cleanseElement)
    const checkResult = compare(userElements, sourceElements)
    return checkResult
}
