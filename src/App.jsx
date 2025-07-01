import { useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Form from './pages/Form'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useSelector } from 'react-redux'
import Loader from './components/Loader'
import Profile from './pages/Profile'


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
              <Home/>
            </ProtectedRoute>
            } />
            <Route path='/profile' element={
              <ProtectedRoute>
                <Profile/>
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
