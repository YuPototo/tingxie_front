import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Advice from './pages/advice/Advice'
import Home from './pages/home/Home'
// import AlbumDiction from './pages/albumDiction/AlbumDiction'
// import AlbumListPage from './pages/albumListPage/AlbumListPage'

function App() {
    return (
        <BrowserRouter basename="/en">
            <Toaster />

            <div className="mx-auto min-h-screen bg-gray-200 px-4 py-4">
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    {/* <Route path="/albums/:albumId/index/:index">
                        <AlbumDiction />
                    </Route> */}
                    <Route path="/advice">
                        <Advice />
                    </Route>
                    {/* <Route path="/albums">
                        <AlbumListPage />
                    </Route> */}
                </Switch>
            </div>
        </BrowserRouter>
    )
}

export default App
