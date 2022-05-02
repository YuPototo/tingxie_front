import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Header from './components/NavHeader'
import { useAppDispatch } from './app/hooks'
import { setIsNewUser } from './features/user/userSlice'
import Routes from './Routes'
import Footer from './components/Footer'

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
                <Routes />
            </div>
            <Footer />
        </BrowserRouter>
    )
}

export default App
