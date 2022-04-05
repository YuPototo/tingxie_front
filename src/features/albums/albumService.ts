import { emptySplitApi } from '../../app/api'
import { RootState } from '../../app/store'

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

export const selectNextTrackIndex =
    (trackId: string, albumId?: string) => (state: RootState) => {
        if (!albumId) return
        const { data } =
            albumApi.endpoints.getAlbumDetail.select(albumId)(state)
        if (!data) return
        const currentIndex = data.tracks.findIndex((el) => el.id === trackId)
        if (currentIndex !== -1 && currentIndex + 1 < data.tracks.length) {
            return currentIndex + 1
        }
    }

export const { useGetAlbumListQuery, useGetAlbumDetailQuery } = albumApi
