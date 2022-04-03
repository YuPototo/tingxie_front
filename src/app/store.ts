import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

import { emptySplitApi } from './api'
import { rtkQueryErrorLogger } from './middleware/queryErrorLog'

import dictationReducer from '../features/dictation/dictationSlice'

export const store = configureStore({
    reducer: {
        [emptySplitApi.reducerPath]: emptySplitApi.reducer,
        dictation: dictationReducer,
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
