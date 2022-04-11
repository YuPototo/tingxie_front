import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { AppThunk } from '../../app/store'

// import type { RootState } from '../../app/store'
export interface UserState {
    isNewUser: boolean | null
}

const initialState: UserState = {
    isNewUser: null,
}

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setIsNewUser: (state, { payload }: PayloadAction<boolean>) => {
            state.isNewUser = payload
        },
    },
})

export const { setIsNewUser } = userSlice.actions

/* selectors */

/* thunks */

export default userSlice.reducer
