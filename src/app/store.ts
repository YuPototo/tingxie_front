import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

import { emptySplitApi } from './api'
import { rtkQueryErrorLogger } from './middleware/queryErrorLog'

import dictationReducer from '../features/dictation/dictationSlice'
import albumReducer from '../features/albums/albumSlice'
import userReducer from '../features/user/userSlice'
import sessionReducer from '../features/session/sessionSlice'

export const store = configureStore({
    reducer: {
        [emptySplitApi.reducerPath]: emptySplitApi.reducer,
        dictation: dictationReducer,
        album: albumReducer,
        user: userReducer,
        session: sessionReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            emptySplitApi.middleware,
            rtkQueryErrorLogger
        ),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>
