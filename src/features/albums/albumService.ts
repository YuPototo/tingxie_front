import { emptySplitApi } from '../../app/api'

type AlbumInfo = {
    id: string
    title: string
}

type TrackInfo = {
    id: string
    title: string
}
interface AlbumDetail extends AlbumInfo {
    tracks: TrackInfo[]
}

type AlbumId = string

export const albumApi = emptySplitApi.injectEndpoints({
    endpoints: (build) => ({
        getAlbumList: build.query<AlbumInfo[], void>({
            query: () => '/albums',
            transformResponse: (res: { albums: AlbumInfo[] }) => res.albums,
        }),
        getAlbumDetail: build.query<AlbumDetail, AlbumId>({
            query: (albumId) => `/albums/${albumId}`,
            transformResponse: (res: { album: AlbumDetail }) => res.album,
        }),
    }),
})

export const { useGetAlbumListQuery, useGetAlbumDetailQuery } = albumApi
