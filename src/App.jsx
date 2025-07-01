import { useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Form from './pages/Form'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useSelector } from 'react-redux'
import Loader from './components/Loader'
import Profile from './pages/Profile'

import { io } from "socket.io-client";
const socket = io('http://localhost:3000');


function App() {

  const loaderState = useSelector((state)=>state.loaderReducer.loader);

  return (
    <>
      <Toaster position='top-center' reverseOrder ={false}/>
      {loaderState && <Loader/>}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <ProtectedRoute>
              <Home socket={socket}/>
            </ProtectedRoute>
            } />
            <Route path='/profile' element={
              <ProtectedRoute>
                <Profile socket={socket}/>
              </ProtectedRoute>
            }/>
          <Route path='/login' element={<Form/>}/>
          <Route path='/signUp' element={<Form/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
