import { cloneDeep } from 'lodash'

/*
    将一额句子拆分为若干元素
*/
export default function splitSentence(text: string) {
    let tmpArr = splitSentenceBySpace(text)
    tmpArr = splitWordByCallback(tmpArr, splitWordByRule)
    return tmpArr
}

/* helpers */
function splitSentenceBySpace(sentence: string) {
    const spaceRegex = /[^\S\r\n]+/
    return sentence.trim().split(spaceRegex) // 匹配空格，但\n不算
}

function splitWordByCallback(
    rawElement: string[],
    cb: (word: string) => string[] | undefined
): string[] {
    const arrCopy = cloneDeep(rawElement)

    let addedCount = 0
    for (let i = 0; i < rawElement.length; i++) {
        const word = rawElement[i]
        const subArr = cb(word) as string[]
        if (!subArr) continue
        arrCopy.splice(i + addedCount, 1, subArr[0], subArr[1])
        addedCount++
    }
    return arrCopy
}

export function splitWordByRule(word: string) {
    // /[,.:]"|—|\n/
    const splitRegex = new RegExp(
        [
            '[,.:]"', // 双引号拆分
            '|',
            '[—\\-]', // 其他可以拆分的标点符号: em dash, hyphen
            '|',
            '\n', // 换行符号
        ].join('')
    )
    const splitter = word.match(splitRegex)
    if (!splitter) return
    const arr = word.split(splitRegex)
    arr[0] = arr[0] + splitter
    return arr
}
