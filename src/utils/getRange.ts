import { ISentence } from '../features/track/trackService'

export default function getRange(
    transcript: ISentence[],
    sentenceIndex: number | null
): [number | undefined, number | undefined] {
    if (sentenceIndex === null) return [undefined, undefined]

    const rangeMin = transcript[sentenceIndex].startTime
    let rangeMax = undefined
    if (sentenceIndex + 1 < transcript.length) {
        rangeMax = transcript[sentenceIndex + 1].startTime
    }
    return [rangeMin, rangeMax]
}
