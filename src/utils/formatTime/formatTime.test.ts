import { formatTime } from './formatTime'

describe('formatTime', () => {
    it('1.1', () => {
        expect(formatTime(1.1)).toBe('0:01')
    })

    it('61.35', () => {
        expect(formatTime(61.25)).toBe('1:01')
    })
})
