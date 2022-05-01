import { WrongType, CheckedElement, CheckedResult, CleanElement } from './type'
import getTwoLargest from './util/getTwoLargest'

function compareParts(
    userElements: CleanElement[],
    source: CleanElement[]
): number {
    let matchCount = 0

    const sourceLen = source.filter((el) => el.shouldCompare).length

    if (sourceLen === 0) return 0

    let sourceIndexModifier = 0
    let userIndexModifier = 0
    for (let i = 0; i < sourceLen; i++) {
        const sourceIndex = i + sourceIndexModifier
        const userIndex = i + userIndexModifier
        const sourceWord = source[sourceIndex]
        const userWord = userElements[userIndex]

        // case 0: either one is undefined
        if (!userWord || !userWord) continue

        // case 1: both are not comparable
        if (!userWord.shouldCompare && !sourceWord.shouldCompare) continue

        // case 2: userWord is comparable, sourceWord is not comparable
        if (userWord.shouldCompare && !sourceWord.shouldCompare) {
            userIndexModifier -= 1
            continue
        }

        // case 3: useWord is not comparable, sourceWord is comparable
        if (!userWord.shouldCompare && sourceWord.shouldCompare) {
            sourceIndexModifier -= 1
            continue
        }

        // case 4: both are comparable
        if (sourceWord.pureElement === userWord.pureElement) {
            matchCount++
        }
    }

    return matchCount / sourceLen
}

function getConditionalScore(
    userElements: CleanElement[],
    sourceElements: CleanElement[],
    userIndex: number, // 正在比较的单词的 index
    sourceIndex: number // 正在比较的单词的 index
) {
    const conditionalScoreMisspell = getMaxScore(
        userElements,
        sourceElements,
        userIndex + 1, // 直接比较下一个 user 单词
        sourceIndex + 1 // 直接比较下一个 source 单词
    )
    const conditionalScoreRedundant = getMaxScore(
        userElements,
        sourceElements,
        userIndex + 1, // 直接比较下一个 user 单词
        sourceIndex // 仍然从这一个单词开始比较
    )
    const conditionalScoreLack = getMaxScore(
        userElements,
        sourceElements,
        userIndex, // 仍然从这个单词开始比较
        sourceIndex + 1 // 从下一个单词开始比较
    )

    return {
        conditionalScoreMisspell,
        conditionalScoreRedundant,
        conditionalScoreLack,
    }
}

function getMaxScore(
    userElements: CleanElement[],
    sourceElements: CleanElement[],
    userIndex: number,
    sourceIndex: number
) {
    const { scoreMisspell, scoreRedundant, scoreLack } = getScores(
        userElements,
        sourceElements,
        userIndex,
        sourceIndex
    )
    return Math.max(scoreMisspell, scoreRedundant, scoreLack)
}

function calcWrongType(
    userElements: CleanElement[],
    sourceElements: CleanElement[],
    userIndex: number,
    sourceIndex: number
): WrongType {
    // 计算出3种 score
    const { scoreMisspell, scoreRedundant, scoreLack } = getScores(
        userElements,
        sourceElements,
        userIndex,
        sourceIndex
    )
    // 选最高的那个
    const [max, secondMax] = getTwoLargest([
        scoreLack,
        scoreRedundant,
        scoreMisspell,
    ])

    // 如果两个 score 一样: 计算 conditional score
    if (max === secondMax) {
        const {
            conditionalScoreMisspell,
            conditionalScoreRedundant,
            conditionalScoreLack,
        } = getConditionalScore(
            userElements,
            sourceElements,
            userIndex,
            sourceIndex
        )

        const maxCondition = Math.max(
            conditionalScoreMisspell,
            conditionalScoreRedundant,
            conditionalScoreLack
        )

        if (maxCondition === conditionalScoreMisspell) return 'misspell'
        if (maxCondition === conditionalScoreRedundant) return 'redundant'
        if (maxCondition === conditionalScoreLack) return 'lack'
    }
    if (max === scoreMisspell) return 'misspell'
    if (max === scoreLack) return 'lack'
    if (max === scoreRedundant) return 'redundant'

    throw Error('不该运行这段')
}

function getScores(
    userElements: CleanElement[],
    sourceElements: CleanElement[],
    userIndex: number,
    sourceIndex: number
) {
    const scoreMisspell = getMisspellScore(
        userElements,
        sourceElements,
        userIndex,
        sourceIndex
    )
    const scoreRedundant = getRedundantScore(
        userElements,
        sourceElements,
        userIndex,
        sourceIndex
    )
    const scoreLack = getLackScore(
        userElements,
        sourceElements,
        userIndex,
        sourceIndex
    )
    return {
        scoreMisspell,
        scoreRedundant,
        scoreLack,
    }
}

function getMisspellScore(
    userElements: CleanElement[],
    source: CleanElement[],
    userInputIndex: number,
    sourceIndex: number
): number {
    return compareParts(
        userElements.slice(userInputIndex),
        source.slice(sourceIndex)
    )
}

function getRedundantScore(
    userElements: CleanElement[],
    source: CleanElement[],
    userInputIndex: number,
    sourceIndex: number
): number {
    return compareParts(
        userElements.slice(userInputIndex + 1),
        source.slice(sourceIndex)
    )
}

function getLackScore(
    userElements: CleanElement[],
    source: CleanElement[],
    userInputIndex: number,
    sourceIndex: number
): number {
    return compareParts(
        userElements.slice(userInputIndex),
        source.slice(sourceIndex + 1)
    )
}

export default function compare(
    userElements: CleanElement[],
    sourceElements: CleanElement[]
): CheckedResult {
    if (sourceElements.length === 0)
        throw Error('sourceElements 不能是空 array')

    const compareLength = Math.max(sourceElements.length, userElements.length)
    const LACK_WORD: CheckedElement = { text: '***', wrongType: 'lack' }

    const result: CheckedResult = []

    let userIndexModifier = 0
    let sourceIndexModifier = 0
    let compareLengthModifier = 0
    let redundantCount = 0

    for (let i = 0; i < compareLength + compareLengthModifier; i++) {
        const userIndex = i + userIndexModifier
        const sourceIndex = i + sourceIndexModifier
        const userEl = userElements[userIndex]
        const sourceEl = sourceElements[sourceIndex]

        compareLengthModifier =
            userElements.length < sourceElements.length ? redundantCount : 0

        // case 1: userEl 和 sourceEl 都不存在
        if (userEl === undefined && sourceEl === undefined) {
            throw Error('userEl 和 sourceEl 不可能都是 undefined')
        }

        // userEl 不存在， sourceEl 存在且可比较
        if (userEl === undefined) {
            if (!sourceEl.shouldCompare) {
                // case 2 sourceEl 不可比较，直接跳过
                continue
            } else {
                // case 3 sourceEl 可以比较，说明 lack 了
                result.push(LACK_WORD)
                continue
            }
        }

        // sourceEl 不存在
        if (sourceEl === undefined) {
            if (!userEl.shouldCompare) {
                // case 4 userEl 不可比较
                sourceIndexModifier -= 1
                result.push({ text: userEl.sourceElement })
                continue
            } else {
                // case 5： userEl 可以比较
                const checkedEl: CheckedElement = {
                    text: userEl.sourceElement,
                    wrongType: 'redundant',
                }
                redundantCount += 1
                result.push(checkedEl)
                continue
            }
        }

        // case 6： 都不可以比较
        if (!userEl.shouldCompare && !sourceEl.shouldCompare) {
            result.push({ text: userEl.sourceElement })
            continue
        }

        // case 7: userEl 可以比较，sourceEl 不可比较
        if (userEl.shouldCompare && !sourceEl.shouldCompare) {
            userIndexModifier -= 1
            compareLengthModifier += 1

            continue
        }

        // case 8: userEl 不可比较，sourceEl 可以比较
        if (!userEl.shouldCompare && sourceEl.shouldCompare) {
            sourceIndexModifier -= 1
            compareLengthModifier += 1
            result.push({ text: userEl.sourceElement })
            continue
        }

        // case 9：都可以比较
        if (userEl.shouldCompare && sourceEl.shouldCompare) {
            if (userEl.pureElement === sourceEl.pureElement) {
                result.push({ text: userEl.sourceElement })
            } else {
                const wrongType = calcWrongType(
                    userElements,
                    sourceElements,
                    userIndex,
                    sourceIndex
                )

                const text = wrongType === 'lack' ? '***' : userEl.sourceElement
                if (wrongType === 'lack') userIndexModifier -= 1
                if (wrongType === 'redundant') {
                    sourceIndexModifier -= 1
                    compareLengthModifier += 1
                    redundantCount += 1
                }
                result.push({ text, wrongType })
            }
            continue
        }

        throw Error('不该进入这里')
    }

    return result
}
