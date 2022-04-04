import { cloneDeep } from 'lodash'
import type { CheckResult, CheckWord, WordMarked } from './type'

export function compareParts(
    userWords: WordMarked[],
    sourceWords: WordMarked[]
): number {
    let matchCount = 0
    const sourceLen = sourceWords.length

    if (sourceLen === 0) {
        return 0
    }

    for (let i = 0; i < sourceLen; i++) {
        const sourceWord = sourceWords[i]
        const compareStopMark = '?.'
        if (
            sourceWord.markAfter &&
            compareStopMark.includes(sourceWord.markAfter)
        )
            break
        if (
            sourceWord.word.toLocaleLowerCase() ===
            userWords[i]?.word.toLocaleLowerCase()
        ) {
            matchCount++
        }
    }
    return matchCount / sourceLen
}

export function compare(
    userInput: WordMarked[],
    source: WordMarked[]
): CheckResult {
    const result = cloneDeep(userInput) as CheckResult
    const LACK_WORD: CheckWord = { word: '***', wrongType: 'lack' }

    const maxLength = Math.max(userInput.length, source.length)
    let redundantCount = 0
    let lackCount = 0
    let maxLengthFixer = 0

    for (let i = 0; i < maxLength + maxLengthFixer; i++) {
        const sourceIndex = i - redundantCount
        const userInputIndex = i - lackCount
        const resultIndex = i

        const userWordMarked = userInput[userInputIndex]
        const sourceWordMarked = source[sourceIndex]

        maxLengthFixer = userInput.length < source.length ? redundantCount : 0

        if (userWordMarked === undefined) {
            // 不再有 userWord
            result.push(cloneDeep(LACK_WORD))

            // move mark
            const previousResultWord = result[resultIndex - 1]
            const previousSourceWord = source[sourceIndex - 1]

            if (
                previousResultWord?.markAfter &&
                previousSourceWord.markAfter === undefined
            ) {
                result[resultIndex].markAfter =
                    result[resultIndex - 1].markAfter
                delete result[resultIndex - 1]?.markAfter
            }
            lackCount++
            continue
        }

        if (sourceWordMarked === undefined) {
            // 说明此时 userInput 多了
            result[resultIndex].wrongType = 'redundant'
            redundantCount++
            continue
        }

        if (
            userWordMarked.word.toLocaleLowerCase() ===
            sourceWordMarked.word.toLocaleLowerCase()
        )
            continue

        const { scoreMisspell, scoreRedundant, scoreLack } = getScores(
            userInput,
            source,
            userInputIndex,
            sourceIndex
        )

        const max = Math.max(scoreLack, scoreRedundant, scoreMisspell)

        if (max === scoreMisspell && max === scoreRedundant) {
            const scoreMisspellNextWord = getMaxScore(
                userInput,
                source,
                userInputIndex + 1,
                sourceIndex + 1
            )

            const scoreRedundantNextWord = getMaxScore(
                userInput,
                source,
                userInputIndex + 1,
                sourceIndex - 1
            )

            if (scoreMisspellNextWord >= scoreRedundantNextWord) {
                result[i].wrongType = 'misspell'
            } else {
                result[i].wrongType = 'redundant'
                redundantCount++
            }
        } else if (max === scoreMisspell) {
            result[i].wrongType = 'misspell'
        } else if (max === scoreRedundant) {
            result[i].wrongType = 'redundant'
            redundantCount++
        } else if (max === scoreLack) {
            result.splice(resultIndex, 0, cloneDeep(LACK_WORD))
            // move mark
            const previousResultWord = result[resultIndex - 1]
            const previousSourceWord = source[sourceIndex - 1]

            if (
                previousResultWord?.markAfter &&
                previousSourceWord.markAfter === undefined
            ) {
                result[resultIndex].markAfter =
                    result[resultIndex - 1].markAfter
                delete result[resultIndex - 1]?.markAfter
            }
            lackCount++
        }
    }

    return result
}

function getMisspellScore(
    userInput: WordMarked[],
    source: WordMarked[],
    userInputIndex: number,
    sourceIndex: number
): number {
    return compareParts(
        userInput.slice(userInputIndex),
        source.slice(sourceIndex)
    )
}

function getRedundantScore(
    userInput: WordMarked[],
    source: WordMarked[],
    userInputIndex: number,
    sourceIndex: number
): number {
    return compareParts(
        userInput.slice(userInputIndex + 1),
        source.slice(sourceIndex)
    )
}

function getLackScore(
    userInput: WordMarked[],
    source: WordMarked[],
    userInputIndex: number,
    sourceIndex: number
): number {
    return compareParts(
        userInput.slice(userInputIndex),
        source.slice(sourceIndex + 1)
    )
}

function getScores(
    userInput: WordMarked[],
    source: WordMarked[],
    userInputIndex: number,
    sourceIndex: number
) {
    const scoreMisspell = getMisspellScore(
        userInput,
        source,
        userInputIndex,
        sourceIndex
    )
    const scoreRedundant = getRedundantScore(
        userInput,
        source,
        userInputIndex,
        sourceIndex
    )
    const scoreLack = getLackScore(
        userInput,
        source,
        userInputIndex,
        sourceIndex
    )
    return {
        scoreMisspell,
        scoreRedundant,
        scoreLack,
    }
}

function getMaxScore(
    userInput: WordMarked[],
    source: WordMarked[],
    userInputIndex: number,
    sourceIndex: number
) {
    const { scoreMisspell, scoreRedundant, scoreLack } = getScores(
        userInput,
        source,
        userInputIndex,
        sourceIndex
    )
    return Math.max(scoreMisspell, scoreRedundant, scoreLack)
}
