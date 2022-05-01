import getTwoLargest from '../util/getTwoLargest'

it('2,1,0', () => {
    expect(getTwoLargest([2, 1, 0])).toEqual([2, 1])
})

it('1,1,0', () => {
    expect(getTwoLargest([1, 1, 0])).toEqual([1, 1])
})

it('1', () => {
    expect(() => {
        getTwoLargest([1])
    }).toThrowError(/array长度必须大于等于2/)
})
