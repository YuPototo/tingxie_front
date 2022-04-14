import { cloneDeep } from 'lodash'
import type { WordMarked } from './type'

/** 判断某个单词的结尾处里是否包含标点符号或换行符号 */
export function containsEndMark(word: string): boolean {
    const re = /[.?,;:]$|(\n)$/ // 以符号结尾，或者以换行结尾
    return re.test(word)
}

/** 把 word 转化为 wordMarked */
export function wordToMarkedWord(word: string): WordMarked {
    if (containsEndMark(word)) {
        const re = /(?<mark>[.?,;:]?(\n)?)$/
        const match = word.match(re) as RegExpMatchArray
        const mark = match.groups?.mark
        return {
            word: word.replace(mark || '', ''),
            markAfter: mark,
        }
    }
    return { word }
}

/** 把中间存在 linebreaker 的单词拆分 */
export function splitByLineBreaker(word: string) {
    if (!word.includes('\n')) return
    const arr = word.split('\n')
    arr[0] = arr[0] + '\n'
    return arr
}

/** 把 text 变为 wordMarked array */
export function textToWordArray(text: string): WordMarked[] {
    const arr = text.split(/[^\S\r\n]+/) // 匹配空格，但\n不算

    const arrCopy = cloneDeep(arr)

    let addedCount = 0
    for (let i = 0; i < arrCopy.length; i++) {
        const word = arrCopy[i]
        if (!word.includes('\n')) continue
        const subArr = splitByLineBreaker(word) as string[]
        arr.splice(i + addedCount, 1, subArr[0], subArr[1])
        addedCount++
    }
    const arrWordMarked = arr.map(wordToMarkedWord)
    return arrWordMarked.filter((el) => el.word !== '')
}
