export default function getTwoLargest(arr: number[]): [number, number] {
    if (arr.length < 2) throw Error('array长度必须大于等于2')
    const max = Math.max(...arr)
    const index = arr.indexOf(max)
    const copyArr = [...arr]
    copyArr.splice(index, 1)
    const secondMax = Math.max(...copyArr)
    return [max, secondMax]
}
