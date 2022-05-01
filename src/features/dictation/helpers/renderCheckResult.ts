import type { CheckedResult, CheckedElement } from '../../../textChecker'

const MISSPELL_CSS = '"text-red-500"'
const LACK_CSS = '"text-yellow-600"'
const REDUNDANT_CSS = '"text-gray-500 line-through"'

export function processCheckWord(checkedElement: CheckedElement): string {
    let word = checkedElement.text
    if (checkedElement.wrongType === 'misspell') {
        word = `<span class=${MISSPELL_CSS}>${word}</span>`
    } else if (checkedElement.wrongType === 'lack') {
        word = `<span class=${LACK_CSS}>${word}</span>`
    } else if (checkedElement.wrongType === 'redundant') {
        word = `<span class=${REDUNDANT_CSS}>${word}</span>`
    }

    return word
}

export function renderCheckResult(checkResult: CheckedResult) {
    return checkResult.map(processCheckWord).join(' ')
}
