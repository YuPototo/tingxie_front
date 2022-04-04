import React from 'react'
import type { CheckResult as ICheckResult } from '../../textChecker'
import { renderCheckResult } from './renderCheckResult'

type Props = { result: ICheckResult; className?: string }

export default function CheckResult({ result, className }: Props) {
    const html = renderCheckResult(result)
    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: html }}
            style={{ whiteSpace: 'pre-wrap' }}
        ></div>
    )
}
