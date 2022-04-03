import React from 'react'
import { useHistory } from 'react-router-dom'
import Button from '../../components/Button'

export default function Advice() {
    const history = useHistory()
    return (
        <div className="page-container">
            <h2 className="my-2 text-lg text-green-600">产品介绍</h2>
            <div className="my-4 text-gray-800">
                <h3 className="font-bold">Why</h3>
                <p className="my-3">Hi，我是这个产品的开发者，覃煜。</p>
                <p>
                    我希望能看懂英文电影和电视剧，不依靠字幕。听写是提高听力的好方法。我对市面上的听写产品不满意，所以自己做了一个。
                </p>
                <p className="my-3">
                    这个产品的载体是网页，因为电脑键盘比手机虚拟键盘更适合打字。现在的产品是一个
                    proof of concept。
                </p>
            </div>

            <div className="my-4 text-gray-800">
                <h3 className="font-bold">What</h3>
                <div className="my-3">
                    计划的功能包括：
                    <ul className="my-2 ml-2 list-inside list-disc ">
                        <li className="my-2">
                            ✅ 每句播放完成后的自动暂停，供打字。
                        </li>
                        <li className="my-2">倍速播放</li>
                        <li className="my-2">
                            快捷键操作暂停、播放、前进、后退、AB点播放
                        </li>
                        <li className="my-2">
                            简写模式：u 代替 you，stu 代替 student
                        </li>
                        <li className="my-2">自动提示专有名词</li>
                        <li className="my-2">更智能的校对算法</li>
                    </ul>
                </div>
            </div>

            <div className="my-4 text-gray-800">
                <h3 className="font-bold">How</h3>
                <p className="my-3">
                    这个产品还处在测试阶段。如果有人愿意付费，我会继续添加内容和功能。
                </p>
                <p className="my-3">
                    价格：暂定
                    <span className="font-bold">5元/月</span>
                </p>
                <p className="my-3">
                    如果你希望这个产品继续开发，请添加我的微信😊
                </p>
                <img src="https://asset-cdn.riyu.love/images/qr_code.jpeg" />
            </div>
            <div className="my-4">
                <Button onClick={() => history.push('/')}>回到首页</Button>
            </div>
        </div>
    )
}
