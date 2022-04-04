export function formatTime(time: number): string {
    const minute = Math.floor(time / 60)
    const second = Math.floor(time) % 60

    const secondReturned = second < 10 ? `0${second}` : second

    return `${minute}:${secondReturned}`
}
