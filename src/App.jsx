import { useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Form from './pages/Form'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {


  return (
    <>
      <Toaster position='top-center' reverseOrder ={false}/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <ProtectedRoute>
              <Home/>
            </ProtectedRoute>
            } />
          <Route path='/login' element={<Form/>}/>
          <Route path='/signUp' element={<Form/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
