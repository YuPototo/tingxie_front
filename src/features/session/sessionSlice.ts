import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { AppThunk } from '../../app/store'

// import type { RootState } from '../../app/store'
export interface SessionState {
    hasNavToAlbum: boolean | null
}

const initialState: SessionState = {
    hasNavToAlbum: null,
}

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setHasNavToAlbum: (state, { payload }: PayloadAction<boolean>) => {
            state.hasNavToAlbum = payload
        },
    },
})

export const { setHasNavToAlbum } = sessionSlice.actions

/* selectors */

/* thunks */

export default sessionSlice.reducer
