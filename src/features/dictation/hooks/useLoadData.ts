import { useEffect } from 'react'
import { useAppDispatch } from '../../../app/hooks'
import { ITrack, useGetTrackQuery } from '../../track/trackService'
import { setDictationStage } from '../dictationSlice'

const useLoadData = (trackId: string): [ITrack | undefined] => {
    const {
        data: track,
        isLoading,
        isError,
        isSuccess,
    } = useGetTrackQuery(trackId)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (isLoading) dispatch(setDictationStage('loadingTrackInfo'))
    }, [isLoading, dispatch])

    useEffect(() => {
        if (isError) dispatch(setDictationStage('error'))
    }, [isError, dispatch])

    useEffect(() => {
        if (isSuccess) dispatch(setDictationStage('loadingAudio'))
    }, [isSuccess, trackId, dispatch])

    return [track]
}

export default useLoadData
