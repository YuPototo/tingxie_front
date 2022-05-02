import React, { useEffect } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Advice from './pages/advice/Advice'
import Home from './pages/home/Home'
import Album from './pages/album/Album'
import AlbumListPage from './pages/albumList/AlbumListPage'
import Header from './components/NavHeader'
import { useAppDispatch } from './app/hooks'
import { setIsNewUser } from './features/user/userSlice'

function App() {
    const dispatch = useAppDispatch()
    useEffect(() => {
        const userLabel = localStorage.getItem('userLabel')
        if (userLabel) dispatch(setIsNewUser(false))
    }, [dispatch])

    return (
        <BrowserRouter>
            <Toaster />

            <Header />
            <div className="mx-auto min-h-screen bg-gray-200 px-4 py-4">
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
            </div>
        </BrowserRouter>
    )
}

export default App
