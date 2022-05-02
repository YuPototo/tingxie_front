import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Advice from './pages/advice/Advice'
import Home from './pages/home/Home'
import Album from './pages/album/Album'
import AlbumListPage from './pages/albumList/AlbumListPage'

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route path="/albums/:albumId">
                <Album />
            </Route>
            <Route path="/advice">
                <Advice />
            </Route>
            <Route path="/albums">
                <AlbumListPage />
            </Route>
        </Switch>
    )
}
