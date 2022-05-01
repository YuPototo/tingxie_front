import React from 'react'
import type { CheckedResult as ICheckedResult } from '../../../textChecker'
import { renderCheckResult } from '../helpers/renderCheckResult'

type Props = { result: ICheckedResult; className?: string }

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
