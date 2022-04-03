import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from '../../app/store'
// import { ITrack } from '../track/trackService'

// import type { RootState } from '../../app/store'

export type DictationStage =
    | 'uninitialized'
    | 'loadingTrackInfo' // 正在加载 track 信息
    | 'loadingAudio' // 正在加载听力
    | 'initialListen' // 加载听力资源成后，进入初次听力
    | 'beforeDictation' // 听写之前的阶段
    | 'dictating' // 正在听写
    | 'afterDictation'
    // 以上状态只能顺序前进
    | 'error' // 出错了

export interface DictationState {
    dictationStage: DictationStage
    sentenceIndex: number | null
    errorInfo: string | null
}

const initialState: DictationState = {
    dictationStage: 'uninitialized',
    sentenceIndex: null,
    errorInfo: null,
}

export const dictationSlice = createSlice({
    name: 'diction',
    initialState,
    reducers: {
        setDictationStage: (
            state,
            { payload }: PayloadAction<DictationStage>
        ) => {
            state.dictationStage = payload
        },
        setSentenceIndex: (state, { payload }: PayloadAction<number>) => {
            state.sentenceIndex = payload
        },
        setErrorInfo: (state, { payload }: PayloadAction<string>) => {
            state.errorInfo = payload
        },
    },
})

export const { setDictationStage, setSentenceIndex, setErrorInfo } =
    dictationSlice.actions

/* selectors */

/* thunks */
export const onPlayEnd = (): AppThunk => async (dispatch, getState) => {
    const state = getState()
    if (state.dictation.dictationStage === 'initialListen') {
        dispatch(setDictationStage('beforeDictation'))
        setTimeout(() => {
            dispatch(setDictationStage('dictating'))
            dispatch(setSentenceIndex(0))
        }, 2000)
    }
}

export default dictationSlice.reducer
