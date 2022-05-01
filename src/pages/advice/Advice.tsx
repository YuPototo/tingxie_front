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
                <h3 className="font-bold">How</h3>
                <p className="my-3">
                    这个产品还处在测试阶段。我还不确定人们真的需要这样的听写产品。
                </p>
                <p className="my-3">
                    这个产品计划会收费：
                    <span className="font-bold">1元/月</span>
                </p>
                <p className="my-3">
                    如果能收到1笔付款，我会知道人们需要这个产品，然后会继续开发。如果你非常需要这个产品，请添加我的微信😊
                </p>
                <img src="https://asset-cdn.riyu.love/images/qr_code.jpeg" />
            </div>
            <div className="my-4">
                <Button onClick={() => history.push('/')}>回到首页</Button>
            </div>
        </div>
    )
}
