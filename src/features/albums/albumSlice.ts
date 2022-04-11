import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from '../../app/store'
import albumProgress from './helpers/albumProgress'

// import type { RootState } from '../../app/store'
export interface AlbumState {
    trackIndex: number // 当前播放的是第几个 track
    hasCheckTrackProgress: boolean // mount album 时，会先 check progress。之后才渲染。
}

const initialState: AlbumState = {
    trackIndex: 0,
    hasCheckTrackProgress: false,
}

export const albumSlice = createSlice({
    name: 'album',
    initialState,
    reducers: {
        setTrackIndex: (state, { payload }: PayloadAction<number>) => {
            state.trackIndex = payload
        },
        setHasCheckTrackProgress: (
            state,
            { payload }: PayloadAction<boolean>
        ) => {
            state.hasCheckTrackProgress = payload
        },
    },
})

export const { setTrackIndex, setHasCheckTrackProgress } = albumSlice.actions

/* selectors */

/* thunks */
export const setAlbumTrackIndex =
    (albumId: string): AppThunk =>
    async (dispatch) => {
        const index = albumProgress.getAlbumProgress(albumId)
        dispatch(setTrackIndex(index))
        dispatch(setHasCheckTrackProgress(true))
    }

export default albumSlice.reducer
