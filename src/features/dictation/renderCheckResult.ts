import type { CheckResult, CheckWord } from '../../textChecker'

const MISSPELL_CSS = '"text-red-500"'
const LACK_CSS = '"text-yellow-600"'
const REDUNDANT_CSS = '"text-gray-500 line-through"'

export function processCheckWord(checkWord: CheckWord): string {
    let word = checkWord.word
    if (checkWord.wrongType === 'misspell') {
        word = `<span class=${MISSPELL_CSS}>${word}</span>`
    } else if (checkWord.wrongType === 'lack') {
        word = `<span class=${LACK_CSS}>${word}</span>`
    } else if (checkWord.wrongType === 'redundant') {
        word = `<span class=${REDUNDANT_CSS}>${word}</span>`
    }
    const markAfter = checkWord.markAfter || ''
    return word + markAfter
}

export function renderCheckResult(checkResult: CheckResult) {
    return checkResult.map(processCheckWord).join(' ')
}
