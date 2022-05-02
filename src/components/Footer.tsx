import React, { ReactElement } from 'react'

import { useHistory } from 'react-router-dom'
import config from '../config'

const VERSION = config.VERSION

export default function Footer(): ReactElement {
    const history = useHistory()

    return (
        <div className="flex flex-row justify-center gap-10 bg-gray-200 pb-4 pt-10 text-sm text-gray-700">
            <div>
                <span
                    className="link mr-2"
                    onClick={() => history.push('/advice')}
                >
                    联系开发者
                </span>
            </div>
            <div>
                <span className="mr-2">版本号</span>
                <span>{VERSION}</span>
            </div>
            <div>
                <span className="mr-2">备案号</span>
                <a className="link" href="https://beian.miit.gov.cn/">
                    粤ICP备2021141310号
                </a>
            </div>
        </div>
    )
}
