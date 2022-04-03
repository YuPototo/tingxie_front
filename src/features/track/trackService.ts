import { emptySplitApi } from '../../app/api'

interface ISentence {
    startTime: number
    text: string
}

export interface ITrack {
    id: string
    title: string
    url: string
    source: ISentence[]
}

type TrackId = string

export const trackApi = emptySplitApi.injectEndpoints({
    endpoints: (build) => ({
        getTrack: build.query<ITrack, TrackId>({
            query: (trackId) => `/tracks/${trackId}`,
            transformResponse: (res: { track: ITrack }) => res.track,
        }),
    }),
})

export const { useGetTrackQuery } = trackApi
