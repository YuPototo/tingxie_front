import React, { useState } from 'react'
import Button from '../../components/Button'
import { ITrack } from '../track/trackService'
import ResultBySentence from './ResultBySentence'

type Props = {
    track: ITrack
    oneTrackOnly: boolean
    onFinishHomeTrack: () => void
}

export default function DictationResult({
    track,
    oneTrackOnly,
    onFinishHomeTrack,
}: Props) {
    const [showSource, setShowSource] = useState(false)

    return (
        <div className="">
            <ResultBySentence
                showSource={showSource}
                audioSrc={track.url}
                transcript={track.source}
                mode="afterDictation"
            />

            <div className="flex items-center gap-4">
                <Button outline onClick={() => setShowSource(!showSource)}>
                    {showSource ? '校对结果' : '原文'}
                </Button>
                {oneTrackOnly && (
                    <Button onClick={onFinishHomeTrack}>选择其他材料</Button>
                )}
            </div>
        </div>
    )
}
